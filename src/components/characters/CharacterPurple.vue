<template>
    <svg id="character-purple" viewBox="0 0 660 800">
        <polygon class="st-purple" :points="computedPointsString" />
        <CharacterPurpleFace
            :mouse-position="mousePosition"
            :face-coordinates="computedFacePosition"
            :face-options="faceOptions"
            :follow-mouse="computedState.state.allowMouseFollow"
            :transform-pupils="computedState.state.transformPupils"
            :face-rotation="faceRotationAnimated"
        />
    </svg>
</template>

<script lang="ts" setup>
import { onMounted, computed, watch } from 'vue'
import { SVG, type Polygon, Timeline } from '@svgdotjs/svg.js'
import CharacterPurpleFace from './CharacterPurpleFace.vue'
import { useCharacterPurpleStates } from '@/composables/useCharacterPurpleStates'
import { useTransition, type UseTransitionOptions } from '@vueuse/core'
import { useCharacterStore } from '@/stores/useCharacterStore'
import { storeToRefs } from 'pinia'

const characterStore = useCharacterStore()
const { characterState } = storeToRefs(characterStore)

const {
    idlePoints,
    idle,
    skewed,
    skewedPoints,
    sad,
    sadPoints,
    nervous,
    nervousPoints,
    faceOptions,
} = useCharacterPurpleStates()

const props = defineProps<{
    mousePosition: {
        x: number
        y: number
    } | null
    isBase?: boolean
}>()

let polygon: Polygon | undefined

const computedPoints = computed(() => ([
    {
        x: topLeftX.value,
        y: topLeftY.value,
    },
    {
        x: kinkLeftX.value,
        y: kinkLeftY.value,
    },
    {
        x: bottomLeftX.value,
        y: bottomLeftY.value,
    },
    {
        x: bottomRightX.value,
        y: bottomRightY.value,
    },
    {
        x: kinkRightX.value,
        y: kinkRightY.value,
    },
    {
        x: topRightX.value,
        y: topRightY.value,
    },
]))

const computedPointsString = computed(() => computedPoints.value.map(coordinate => `${coordinate!.x} ${coordinate!.y}`).join(' '))
const computedFacePosition = computed(() => ({ x: faceCoordinatesX.value, y: faceCoordinatesY.value }))

const computedState = computed(() => {
    const idleObj = {
        state: idle.value,
        points: idlePoints.value,
    }

    const skewedObj = {
        state: skewed.value,
        points: skewedPoints.value,
    }

    const sadObj = {
        state: sad.value,
        points: sadPoints.value,
    }

    const nervousObj = {
        state: nervous.value,
        points: nervousPoints.value,
    }
    if (characterState.value === 'curious') {
        return skewedObj
    }
    if (characterState.value === 'sad') {
        return sadObj
    }
    if (characterState.value === 'nervous') {
        return nervousObj
    }
    return idleObj
})

const transitionOptions: UseTransitionOptions = {
    duration: 500,
    transition: [0.3, 0.22, 0, 0.99],
}

const topLeftX = useTransition(() => computedState.value.points[0]!.x, transitionOptions)
const topLeftY = useTransition(() => computedState.value.points[0]!.y, transitionOptions)
const kinkLeftX = useTransition(() => computedState.value.points[1]!.x, transitionOptions)
const kinkLeftY = useTransition(() => computedState.value.points[1]!.y, transitionOptions)
const bottomLeftX = useTransition(() => computedState.value.points[2]!.x, transitionOptions)
const bottomLeftY = useTransition(() => computedState.value.points[2]!.y, transitionOptions)
const bottomRightX = useTransition(() => computedState.value.points[3]!.x, transitionOptions)
const bottomRightY = useTransition(() => computedState.value.points[3]!.y, transitionOptions)
const kinkRightX = useTransition(() => computedState.value.points[4]!.x, transitionOptions)
const kinkRightY = useTransition(() => computedState.value.points[4]!.y, transitionOptions)
const topRightX = useTransition(() => computedState.value.points[5]!.x, transitionOptions)
const topRightY = useTransition(() => computedState.value.points[5]!.y, transitionOptions)

const faceCoordinatesX = useTransition(() => computedState.value.state.faceCoordinates.x, transitionOptions)
const faceCoordinatesY = useTransition(() => computedState.value.state.faceCoordinates.y, transitionOptions)
const faceRotationAnimated = useTransition(() => computedState.value.state.faceRotation, transitionOptions)

onMounted(async () => {
    const svg = SVG('#character-black')
    const poly = svg.findOne('polygon') as Polygon
    if (!poly) return

    polygon = poly
})

</script>

<style lang="scss" scoped>
.st-purple {
    fill: #732eff;
}
</style>
