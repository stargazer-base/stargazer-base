import { useState, useCallback, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface VideoLog {
  youtube_video_id: string;
  is_watched: boolean;
  comment: string | null;
}

export function useVideoLog(initialLogs: VideoLog[], userId: string | null) {
  const [logs, setLogs] = useState<Record<string, { is_watched: boolean, comment: string }>>(() => {
    const map: Record<string, { is_watched: boolean, comment: string }> = {};
    for (const log of initialLogs) {
      map[log.youtube_video_id] = {
        is_watched: log.is_watched || false,
        comment: log.comment || '',
      };
    }
    return map;
  });
  
  const supabase = createClient();
  const debounceRef = useRef<{ [videoId: string]: NodeJS.Timeout }>({});
  
  const logsRef = useRef(logs);
  useEffect(() => {
    logsRef.current = logs;
  }, [logs]);
  
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

    setLogs(prev => {
      const currentComment = prev[videoId]?.comment || '';
      return {
        ...prev,
        [videoId]: { is_watched: isWatched, comment: currentComment }
      };
    });

    if (debounceRef.current[videoId]) {
      clearTimeout(debounceRef.current[videoId]);
    }

    debounceRef.current[videoId] = setTimeout(async () => {
      try {
        const currentComment = logsRef.current[videoId]?.comment || '';

        const { error } = await supabase
          .from('video_logs')
          .upsert(
            { user_id: userId, youtube_video_id: videoId, is_watched: isWatched, comment: currentComment },
            { onConflict: 'user_id, youtube_video_id' }
          );

        if (error) {
          throw error;
        }
      } catch (err) {
        console.error("Failed to upsert video_logs:", err);
        setLogs(prevLogs => {
          const currentComment = prevLogs[videoId]?.comment || '';
          return {
            ...prevLogs,
            [videoId]: { is_watched: !isWatched, comment: currentComment }
          };
        });
        alert('視聴状態の保存に失敗しました。');
      }
    }, 500);
  }, [userId, supabase]);

  const updateComment = useCallback(async (videoId: string, comment: string) => {
    if (!userId) {
      alert('ログインが必要です');
      return false;
    }

    let isSuccess = false;

    const currentState = logsRef.current[videoId] || { is_watched: false, comment: '' };
    const currentWatched = currentState.is_watched;
    const prevComment = currentState.comment;

    // Optimistic UI update
    setLogs(prev => ({
      ...prev,
      [videoId]: { is_watched: currentWatched, comment }
    }));

    try {
      const { error } = await supabase
        .from('video_logs')
        .upsert(
          { user_id: userId, youtube_video_id: videoId, is_watched: currentWatched, comment: comment },
          { onConflict: 'user_id, youtube_video_id' }
        );

      if (error) {
        throw error;
      }
      isSuccess = true;
    } catch (err) {
      console.error("Failed to upsert video_logs comment:", err);
      // Rollback
      setLogs(prev => ({
        ...prev,
        [videoId]: { is_watched: currentWatched, comment: prevComment }
      }));
      alert('コメントの保存に失敗しました。');
      isSuccess = false;
    }

    return isSuccess;
  }, [logs, userId, supabase]);

  return { logs, toggleWatchStatus, updateComment };
}
