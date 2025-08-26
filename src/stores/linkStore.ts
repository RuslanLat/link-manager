import { defineStore, acceptHMRUpdate } from "pinia";
import { ref } from 'vue'
import type { linkWithCategoryQuery, Payload } from "@/composables/useLink";


export const useLinkStore = defineStore('link', () => {

    const listLink = ref<linkWithCategoryQuery>([])
    const onlyFavorites = ref(false)
    const sortByPopular = ref(false)
    const totalLinks = ref(0)
    const hasMore = ref(true)
    const offset = ref(0)

    function changeIsFavorite(id: number) {
        listLink.value.forEach((link) => {
            if (link.id === id) {
                link.isFavorite = !link.isFavorite
            }
        })
    }

    function removeLink(id: number) {
        listLink.value = listLink.value.filter((link) => link.id != id)
    }

    function addClickCount(id: number) {
        const linkId = listLink.value.findIndex((link) => link.id === id)
        if (linkId !== -1) {
            listLink.value[linkId].clickCount! += 1
        }
    }

    function getLinkById(id: number) {
        return listLink.value.find((link) => link.id === id) as linkWithCategoryQuery[number]
    }

    function updateLink(payload: Payload, id: number) {
        const linkId = listLink.value.findIndex((link) => link.id === id)
        if (linkId !== -1) {
            listLink.value[linkId].name = payload.name as string
            listLink.value[linkId].description = payload.description as string
        }
    }

    return {
        listLink,
        changeIsFavorite,
        removeLink,
        addClickCount,
        getLinkById,
        updateLink,
        onlyFavorites,
        sortByPopular,
        totalLinks,
        hasMore,
        offset
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useLinkStore, import.meta.hot))
}