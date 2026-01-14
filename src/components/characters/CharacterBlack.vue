<template>
    <svg
        id="character-black"
        viewBox="0 0 660 800"
        :class="{
            'is-base': isBase
        }"
    >
        <polygon class="st0" points="343 355 343 618 450 618 450 355" />
        <CharacterBlackFace :mouse-position="mousePosition" :default-position="defaultFacePosition" />
    </svg>
</template>

<script lang="ts" setup>
import { onMounted, computed, watch } from 'vue'
import { SVG, type Polygon, Timeline } from '@svgdotjs/svg.js'
import { sleep } from '@/utils/sleep'
import CharacterBlackFace from './CharacterBlackFace.vue'

const props = defineProps<{
    characterMode: 'idle' | 'skew' | 'gek'
    mousePosition: {
        x: number
        y: number
    } | null
    isBase?: boolean
}>()

let polygon: Polygon | undefined

watch(
    () => props.characterMode,
    (newVal) => {
        if (newVal === 'gek') {
            goToGek()
        }
        if (newVal === 'idle') {
            goToIdle()
        }
        if (newVal === 'skew') {
            goToSkew()
        }
    },
)

const defaultFacePosition = computed(() => ({
    x: 380,
    y: 390,
}))

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
