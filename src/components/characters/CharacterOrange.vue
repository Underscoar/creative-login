<template>
    <svg id="character-orange" viewBox="0 0 660 800">
        <path class="st-orange" :d="idlePath" />
        <CharacterOrangeFace
            :mouse-position="mousePosition"
            :face-coordinates="computedFacePosition"
            :face-options="faceOptions"
            :follow-mouse="computedState.state.allowMouseFollow"
            :face-width="computedState.state.faceWidth"
        />
    </svg>
</template>

<script lang="ts" setup>
import { onMounted, computed, watch } from 'vue'
import { SVG, type Polygon, Timeline } from '@svgdotjs/svg.js'
import { useCharacterOrangeStates } from '@/composables/useCharacterOrangeStates'
import { useTransition, type UseTransitionOptions } from '@vueuse/core'
import { useCharacterStore } from '@/stores/useCharacterStore'
import { storeToRefs } from 'pinia'
import CharacterOrangeFace from './CharacterOrangeFace.vue'

const characterStore = useCharacterStore()
const { characterState } = storeToRefs(characterStore)

// Head position: -100 (fully left) to 100 (fully right)
// Computed from mouse position relative to face center
const headPosX = computed(() => {
    if (!props.mousePosition) return 0

    // Base face center (before head movement is applied)
    // These are the static center coordinates from the idle state
    const baseFaceCenterX = 100 + (275 / 2) // basePosition.left + width/2

    // How far the mouse can be from center before hitting max (-100 or 100)
    const maxDistance = 300

    const deltaX = props.mousePosition.x - baseFaceCenterX
    const normalized = (deltaX / maxDistance) * 100

    // Clamp to -100 to 100 range
    return Math.max(-100, Math.min(100, normalized))
})

// Head position Y: -100 (fully up) to 100 (fully down)
const headPosY = computed(() => {
    if (!props.mousePosition) return 0

    // Base face center Y coordinate
    const baseFaceCenterY = 618 - 200 + 150 // floor - height + 150

    // How far the mouse can be from center before hitting max
    const maxDistance = 300

    const deltaY = props.mousePosition.y - baseFaceCenterY
    const normalized = (deltaY / maxDistance) * 100

    // Clamp to -100 to 100 range
    return Math.max(-100, Math.min(100, normalized))
})

const {
    idle,
    faceOptions,
} = useCharacterOrangeStates(headPosX, headPosY)

const props = defineProps<{
    mousePosition: {
        x: number
        y: number
    } | null
    isBase?: boolean
}>()

const idlePath = computed(() => {
    const s = idle.value.characterSVGData.start
    const seg = idle.value.characterSVGData.segments[0]
    return `M${s.x},${s.y}c${seg!.handle1.dx},${seg!.handle1.dy},${seg!.handle2.dx},${seg!.handle2.dy},${seg!.end.dx},${seg!.end.dy}`
})

const computedState = computed(() => {
    const idleObj = {
        state: idle.value,
    }

    // const skewedObj = {
    //     state: skewed.value,
    //     points: skewedPoints.value,
    // }

    // const sadObj = {
    //     state: sad.value,
    //     points: sadPoints.value,
    // }

    // const nervousObj = {
    //     state: nervous.value,
    //     points: nervousPoints.value,
    // }
    // if (characterState.value === 'curious') {
    //     return skewedObj
    // }
    // if (characterState.value === 'sad') {
    //     return sadObj
    // }
    // if (characterState.value === 'nervous') {
    //     return nervousObj
    // }
    return idleObj
})

const computedFacePosition = computed(() => ({ x: faceCoordinatesX.value, y: faceCoordinatesY.value }))

const transitionOptions: UseTransitionOptions = {
    duration: 500,
    transition: [0.3, 0.22, 0, 0.99],
}

const faceCoordinatesX = useTransition(() => computedState.value.state.faceCoordinates.x, transitionOptions)
const faceCoordinatesY = useTransition(() => computedState.value.state.faceCoordinates.y, transitionOptions)

</script>

<style lang="scss" scoped>
.st-orange {
    fill: #ff8332;
}
</style>
