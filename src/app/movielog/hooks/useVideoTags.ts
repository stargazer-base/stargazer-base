import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface Tag {
  id: string;
  name: string;
}

export function useVideoTags(
  initialTags: Tag[],
  initialVideoTags: { youtube_video_id: string; tag_id: string }[],
  userId: string | null
) {
  const [userTags, setUserTags] = useState<Tag[]>(initialTags);
  const [videoTagsMap, setVideoTagsMap] = useState<Record<string, string[]>>(() => {
    const map: Record<string, string[]> = {};
    for (const vt of initialVideoTags || []) {
      if (!map[vt.youtube_video_id]) {
        map[vt.youtube_video_id] = [];
      }
      const arr = map[vt.youtube_video_id];
      if (arr) arr.push(vt.tag_id);
    }
    return map;
  });

  const supabase = createClient();

  const updateVideoTags = useCallback(
    async (videoId: string, selectedExistingTagIds: string[], newTagNames: string[]) => {
      if (!userId) {
        alert('ログインが必要です');
        return false;
      }

      let tagIdsToLink = [...selectedExistingTagIds];

      const newlyCreatedTags: Tag[] = [];
      if (newTagNames.length > 0) {
        const tagsToInsert = newTagNames.map((name) => ({
          user_id: userId,
          name: name,
        }));
        
        // Upsert tags on user_id and name
        const { data: insertedTags, error: tagInsertError } = await supabase
          .from('tags')
          .upsert(tagsToInsert, { onConflict: 'user_id, name' })
          .select();

        if (tagInsertError) {
          console.error('Failed to insert tags:', tagInsertError);
          alert('タグの作成に失敗しました。');
          return false;
        }

        if (insertedTags) {
          const tagsToAdd = insertedTags.map((t) => ({ id: t.id, name: t.name }));
          newlyCreatedTags.push(...tagsToAdd);
          tagIdsToLink = [...tagIdsToLink, ...tagsToAdd.map(t => t.id)];
        }
      }

      if (newlyCreatedTags.length > 0) {
        setUserTags((prev) => {
          const combined = [...prev, ...newlyCreatedTags];
          const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
          return unique;
        });
      }

      const currentTagIds = videoTagsMap[videoId] || [];
      const tagsToAdd = tagIdsToLink.filter((id) => !currentTagIds.includes(id));
      const tagsToRemove = currentTagIds.filter((id) => !tagIdsToLink.includes(id));

      const ops = [];

      if (tagsToAdd.length > 0) {
        ops.push(
          supabase
            .from('video_tags')
            .upsert(
              tagsToAdd.map((tagId) => ({
                user_id: userId,
                youtube_video_id: videoId,
                tag_id: tagId,
              })),
              { onConflict: 'user_id, youtube_video_id, tag_id' }
            )
        );
      }

      if (tagsToRemove.length > 0) {
        // Find existing records to mark as deleted, or delete directly using .update
        // Since Supabase RPC or simple update with .in and .eq works well:
        ops.push(
          supabase
            .from('video_tags')
            .delete()
            .in('tag_id', tagsToRemove)
            .eq('youtube_video_id', videoId)
            .eq('user_id', userId)
        );
      }

      if (ops.length > 0) {
        try {
          const results = await Promise.all(ops);
          const hasError = results.some((res) => res.error);
          if (hasError) {
             console.error('Failed to update video tags', results);
             alert('動画のタグ更新に失敗しました。');
             return false;
          }
        } catch (error) {
           console.error('Failed to update video tags:', error);
           alert('動画のタグ更新に失敗しました。');
           return false;
        }
      }

      setVideoTagsMap((prev) => ({
        ...prev,
        [videoId]: tagIdsToLink,
      }));

      return true;
    },
    [userId, supabase, videoTagsMap]
  );

  return { userTags, videoTagsMap, updateVideoTags };
}
