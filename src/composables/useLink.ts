import { supabase } from '@/supabase'
import { useRequest } from '@/composables/useRequest'
import type { PostgrestError, QueryData } from '@supabase/supabase-js'
import type { Tables } from "@/database.types.ts";
import { useLinkStore } from '@/stores/linkStore';


const LIMIT = 1
const linkWithCategoryQuery = supabase.from('links')
    .select('id, name, url, description, isFavorite, previewImage, clickCount, categories (id, name, created_at, user_id)')
    .order('created_at', { ascending: false })

export type linkWithCategoryQuery = QueryData<typeof linkWithCategoryQuery>;
export type Payload = Partial<Omit<Tables<'links'>, 'created_at' | 'id'>>

export function useLink() {
    const linkStore = useLinkStore()
    const { loading, errorMessage, handleRequest } = useRequest()

    async function saveLink(payload: Payload) {
        return handleRequest<linkWithCategoryQuery, PostgrestError>(async () => {
            const { data, error } = await supabase.from('links')
                .insert(payload).select('id, name, url, description, isFavorite, previewImage, clickCount, categories (id, name, created_at, user_id)')
            if (error) throw error
            return data
        })
    }

    async function getLink(resetPages = false, resetFilters = false) {
        return handleRequest<linkWithCategoryQuery, PostgrestError>(async () => {
            loading.value = true
            if (resetPages) {
                linkStore.offset = 0
                linkStore.listLink = []
                linkStore.hasMore = true
            }

            if (resetFilters) {
                linkStore.sortByPopular = false
                linkStore.onlyFavorites = false
            }

            let query = supabase.from('links')
                .select('id, name, url, description, isFavorite, previewImage, clickCount, categories (id, name, created_at, user_id)', { count: 'exact' })
                .range(linkStore.offset, linkStore.offset + LIMIT - 1)

            if (linkStore.onlyFavorites) {
                query = query.eq('isFavorite', true)
            }
            if (linkStore.sortByPopular) {
                query = query.order('clickCount', { ascending: false })
            } else {
                query = query.order('created_at', { ascending: false })
            }
            const { data, error, count } = await query
            loading.value = false
            if (error) throw error

            linkStore.totalLinks = count as number
            linkStore.offset += data!.length
            linkStore.hasMore = linkStore.offset < linkStore.totalLinks

            return data
        })
    }

    async function changeIsFavorite(id: number, isFavorite: boolean) {
        return handleRequest<null, PostgrestError>(async () => {
            const { error } = await supabase
                .from('links')
                .update({ isFavorite })
                .eq('id', id)
            if (error) throw error
            return null
        })
    }

    async function deleteLink(id: number) {
        return handleRequest<null, PostgrestError>(async () => {
            const { error } = await supabase.from('links').delete().eq('id', id)
            if (error) throw error
            return null
        })

    }

    async function addClickCount(id: number, clickCount: number) {
        return handleRequest<null, PostgrestError>(async () => {
            const { error } = await supabase
                .from('links')
                .update({ clickCount })
                .eq('id', id)
            if (error) throw error
            return null
        })
    }

    async function updateLink(payload: Payload, id: number) {
        return handleRequest<null, PostgrestError>(async () => {
            const { error } = await supabase.from('links').update(payload).eq('id', id)
            if (error) throw error
            return null
        })
    }


    return { loading, errorMessage, saveLink, getLink, changeIsFavorite, deleteLink, addClickCount, updateLink }
}