import { useState, useCallback, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface VideoLog {
  youtube_video_id: string;
  is_watched: boolean;
  comment: string | null;
  is_favorite: boolean | null;
}

export function useVideoLog(initialLogs: VideoLog[], userId: string | null) {
  const [logs, setLogs] = useState<Record<string, { is_watched: boolean, comment: string, is_favorite: boolean }>>(() => {
    const map: Record<string, { is_watched: boolean, comment: string, is_favorite: boolean }> = {};
    for (const log of initialLogs) {
      map[log.youtube_video_id] = {
        is_watched: log.is_watched || false,
        comment: log.comment || '',
        is_favorite: log.is_favorite || false,
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
      const current = prev[videoId] || { is_watched: false, comment: '', is_favorite: false };
      return {
        ...prev,
        [videoId]: { ...current, is_watched: isWatched }
      };
    });

    if (debounceRef.current[videoId]) {
      clearTimeout(debounceRef.current[videoId]);
    }

    debounceRef.current[videoId] = setTimeout(async () => {
      try {
        const currentComment = logsRef.current[videoId]?.comment || '';
        const currentFavorite = logsRef.current[videoId]?.is_favorite || false;

        const { error } = await supabase
          .from('video_logs')
          .upsert(
            { user_id: userId, youtube_video_id: videoId, is_watched: isWatched, comment: currentComment, is_favorite: currentFavorite },
            { onConflict: 'user_id, youtube_video_id' }
          );

        if (error) {
          throw error;
        }
      } catch (err) {
        console.error("Failed to upsert video_logs:", err);
        setLogs(prevLogs => {
          const current = prevLogs[videoId] || { is_watched: false, comment: '', is_favorite: false };
          return {
            ...prevLogs,
            [videoId]: { ...current, is_watched: !isWatched }
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

    const currentState = logsRef.current[videoId] || { is_watched: false, comment: '', is_favorite: false };
    const prevComment = currentState.comment;

    // Optimistic UI update
    setLogs(prev => ({
      ...prev,
      [videoId]: { ...currentState, comment: comment }
    }));

    try {
      const { error } = await supabase
        .from('video_logs')
        .upsert(
          { user_id: userId, youtube_video_id: videoId, is_watched: currentState.is_watched, comment: comment, is_favorite: currentState.is_favorite },
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
        [videoId]: { ...currentState, comment: prevComment }
      }));
      alert('コメントの保存に失敗しました。');
      isSuccess = false;
    }

    return isSuccess;
  }, [logs, userId, supabase]);

  const toggleFavoriteStatus = useCallback((videoId: string, isFavorite: boolean) => {
    if (!userId) {
      alert('ログインが必要です');
      return;
    }

    setLogs(prev => {
      const current = prev[videoId] || { is_watched: false, comment: '', is_favorite: false };
      return {
        ...prev,
        [videoId]: { ...current, is_favorite: isFavorite }
      };
    });

    if (debounceRef.current[videoId + '_fav']) {
      clearTimeout(debounceRef.current[videoId + '_fav']);
    }

    debounceRef.current[videoId + '_fav'] = setTimeout(async () => {
      try {
        const current = logsRef.current[videoId] || { is_watched: false, comment: '', is_favorite: false };
        
        const { error } = await supabase
          .from('video_logs')
          .upsert(
            { user_id: userId, youtube_video_id: videoId, is_watched: current.is_watched, comment: current.comment, is_favorite: isFavorite },
            { onConflict: 'user_id, youtube_video_id' }
          );

        if (error) {
          throw error;
        }
      } catch (err) {
        console.error("Failed to upsert video_logs favorite:", err);
        setLogs(prevLogs => {
          const current = prevLogs[videoId] || { is_watched: false, comment: '', is_favorite: false };
          return {
            ...prevLogs,
            [videoId]: { ...current, is_favorite: !isFavorite }
          };
        });
        alert('お気に入りの保存に失敗しました。');
      }
    }, 500);
  }, [userId, supabase]);

  return { logs, toggleWatchStatus, updateComment, toggleFavoriteStatus };
}
