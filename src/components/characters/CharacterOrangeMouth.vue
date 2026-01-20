<template>
    <g
        id="orange-mouths"
        ref="mouths"
        class="mouths"
        :transform="mouthTransform"
    >
        <circle class="st0 mouth-circle mouth-shape" :class="{ 'hidden': characterState !== 'curious' }" :r="faceOptions.mouthRadius" />
        <path
            class="mouth-shape"
            :class="{ 'hidden': characterState !== 'idle' }"
            :transform="`translate(${faceOptions.mouthRadius * -2},${faceOptions.mouthRadius * -1})`"
            :d="mouthPath"
        />
    </g>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useCharacterStore } from '@/stores/useCharacterStore'
import { storeToRefs } from 'pinia'

const characterStore = useCharacterStore()
const { characterState } = storeToRefs(characterStore)

const props = defineProps<{
    faceOptions: {
        eyeRadius: number
        spacing: number
        mouthRadius: number
    }
    faceWidth: number
}>()

const mouthPath = computed(() => {
    const w = props.faceOptions.mouthRadius * 4
    const h = w / 2
    const halfW = w / 2
    // Half circle path: start at center-top, curve down and around
    return `M${halfW},${h}c${halfW * 0.557},0,${halfW}-${h * 0.429},${halfW}-${h}H0c0,${h * 0.543},${halfW * 0.429},${h},${halfW},${h}Z`
})

const mouthTransform = computed(() => {
    return `translate(${(props.faceWidth / 2) - props.faceOptions.mouthRadius},${8})`
})
</script>

<style lang="scss" scoped>
.mouth-shape {
    fill: #1b1d21;
    transition: transform 0.3s, opacity 0.3s;

    &.hidden {
        transform: scale(0);
        opacity: 0;
    }
}
</style>
