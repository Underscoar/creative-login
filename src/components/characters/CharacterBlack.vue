<template>
    <svg
        id="character-black"
        viewBox="0 0 660 800"
        :class="{
            'is-base': isBase
        }"
    >
        <defs>
            <clipPath id="character-clip">
                <polygon :points="computedPointsString" />
            </clipPath>
        </defs>
        <polygon class="st0" :points="computedPointsString" />
        <g clip-path="url(#character-clip)">
            <CharacterBlackFace
                :mouse-position="mousePosition"
                :face-coordinates="computedFacePosition"
                :face-options="faceOptions"
                :follow-mouse="computedState.state.allowMouseFollow"
                :transform-pupils="computedState.state.transformPupils"
            />
        </g>
    </svg>
</template>

<script lang="ts" setup>
import { onMounted, computed, watch, ref } from 'vue'
import { SVG, type Polygon, Timeline } from '@svgdotjs/svg.js'
import { sleep } from '@/utils/sleep'
import CharacterBlackFace from './CharacterBlackFace.vue'
import { useCharacterBlackStates } from '@/composables/useCharacterBlackStates'
import { useTransition, type UseTransitionOptions } from '@vueuse/core'
import { useCharacterStore } from '@/stores/useCharacterStore'
import { storeToRefs } from 'pinia'

const characterStore = useCharacterStore()
const { characterState } = storeToRefs(characterStore)

const {
    idlePoints,
    idle,
    faceOptions,
    skewed,
    skewedPoints,
    sad,
    sadPoints,
    nervous,
    nervousPoints,
} = useCharacterBlackStates()

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
        x: bottomLeftX.value,
        y: bottomLeftY.value,
    },
    {
        x: bottomRightX.value,
        y: bottomRightY.value,
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
const bottomLeftX = useTransition(() => computedState.value.points[1]!.x, transitionOptions)
const bottomLeftY = useTransition(() => computedState.value.points[1]!.y, transitionOptions)
const bottomRightX = useTransition(() => computedState.value.points[2]!.x, transitionOptions)
const bottomRightY = useTransition(() => computedState.value.points[2]!.y, transitionOptions)
const topRightX = useTransition(() => computedState.value.points[3]!.x, transitionOptions)
const topRightY = useTransition(() => computedState.value.points[3]!.y, transitionOptions)

const faceCoordinatesX = useTransition(() => computedState.value.state.faceCoordinates.x, transitionOptions)
const faceCoordinatesY = useTransition(() => computedState.value.state.faceCoordinates.y, transitionOptions)

// watch(
//     () => props.characterMode,
//     (newVal) => {
//         if (newVal === 'gek') {
//             goToGek()
//         }
//         if (newVal === 'idle') {
//             goToIdle()
//         }
//         if (newVal === 'skew') {
//             goToSkew()
//         }
//     },
// )

onMounted(async () => {
    const svg = SVG('#character-black')
    const poly = svg.findOne('polygon') as Polygon
    if (!poly) return

    polygon = poly

    await sleep(500)
})

function cancelAnimation() {
    polygon!.timeline(new Timeline())
}

function goToGek() {
    cancelAnimation()
    polygon!
        .animate(2000)
        .plot([
            [500, 600],
            [343, 618],
            [450, 618],
            [480, 355],
        ])
}

function goToSkew() {
    cancelAnimation()
    polygon!
        .animate(2000)
        .plot([
            [373, 355],
            [343, 618],
            [450, 618],
            [480, 355],
        ])
}

function goToIdle() {
    cancelAnimation()
    polygon!
        .animate(2000)
        .plot([
            [343, 355],
            [343, 618],
            [450, 618],
            [450, 355],
        ])
}
</script>

<style lang="scss" scoped>
.st0 {
    fill: #1b1d21;
}
</style>
