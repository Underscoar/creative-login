import { computed, nextTick, ref } from 'vue'
import { defineStore } from 'pinia'

export const useCharacterStore = defineStore('character', () => {
    const characterState = ref<'idle' | 'curious' | 'sad' | 'nervous'>('idle')
    return {
        characterState,
    }
})
