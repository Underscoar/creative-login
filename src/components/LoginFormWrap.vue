<template>
    <div class="login-form-wrap">
        <div class="login-form-content">
            <button @click="characterState = 'curious'">
                Curious
            </button>
            <button @click="characterState = 'idle'">
                Idle
            </button>
            <button @click="characterState = 'sad'">
                Sad
            </button>
            <button @click="characterState = 'nervous'">
                Nervous
            </button>

            <div>
                {{ mousePosition?.x || 'null' }},
                {{ mousePosition?.y || 'null' }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useCharacterStore } from '@/stores/useCharacterStore'
import { storeToRefs } from 'pinia'

const characterStore = useCharacterStore()
const { characterState } = storeToRefs(characterStore)

const props = defineProps<{
    mousePosition: {
        x: number
        y: number
    } | null
}>()
</script>

<style lang="scss" scoped>
.login-form-wrap {
    padding: 0.5rem;
    padding-left: 0;
    flex-grow: 1;

    .login-form-content {
        background: #fff;
        border-radius: 15px;
        height: 100%;
    }
}
</style>
