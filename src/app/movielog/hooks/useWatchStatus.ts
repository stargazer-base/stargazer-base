import { useState, useCallback, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useWatchStatus(initialWatchedVideoIds: string[], userId: string | null) {
  const [watchedVideoIds, setWatchedVideoIds] = useState<Set<string>>(new Set(initialWatchedVideoIds));
  const supabase = createClient();
  
  // debouncing logic
  const debounceRef = useRef<{ [videoId: string]: NodeJS.Timeout }>({});
  
  // Clean up timeouts on unmount
  useEffect(() => {
    const currentRefs = debounceRef.current;
    return () => {
      Object.values(currentRefs).forEach(clearTimeout);
    };
  }, []);

  const toggleWatchStatus = useCallback((videoId: string, isWatched: boolean) => {
    if (!userId) {
      alert('ログインが必要です');
      return;
    }

    // Optimistic UI update
    setWatchedVideoIds(prev => {
      const next = new Set(prev);
      if (isWatched) {
        next.add(videoId);
      } else {
        next.delete(videoId);
      }
      return next;
    });

    // Clear previous timeout for this video
    if (debounceRef.current[videoId]) {
      clearTimeout(debounceRef.current[videoId]);
    }

    // Set new timeout for debounced DB update
    debounceRef.current[videoId] = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('video_logs')
          .upsert(
            { user_id: userId, youtube_video_id: videoId, is_watched: isWatched },
            { onConflict: 'user_id, youtube_video_id' }
          );

        if (error) {
          console.error("Failed to upsert video_logs:", error);
          // Rollback UI state on error
          setWatchedVideoIds(prev => {
             const rollback = new Set(prev);
             if (isWatched) {
               rollback.delete(videoId);
             } else {
               rollback.add(videoId);
             }
             return rollback;
          });
          alert('視聴状態の保存に失敗しました。');
        }
      } catch (err) {
        console.error("Exception during upsert:", err);
        // Rollback UI state on error
        setWatchedVideoIds(prev => {
           const rollback = new Set(prev);
           if (isWatched) {
             rollback.delete(videoId);
           } else {
             rollback.add(videoId);
           }
           return rollback;
        });
        alert('視聴状態の保存に失敗しました。');
      }
    }, 500);
  }, [userId, supabase]);

  return { watchedVideoIds, toggleWatchStatus };
}
