<template>
    <svg id="character-purple" viewBox="0 0 660 800">
        <polygon class="st-purple" :points="computedPointsString" />
        <CharacterPurpleFace :mouse-position="mousePosition" :default-position="defaultFacePosition" />
    </svg>
</template>

<script lang="ts" setup>
import { onMounted, computed, watch } from 'vue'
import { SVG, type Polygon, Timeline } from '@svgdotjs/svg.js'
import CharacterPurpleFace from './CharacterPurpleFace.vue'
import { sleep } from '@/utils/sleep'

const characterPoints = computed(() => {
    const width = 190
    const height = 400

    const left = 200
    const bottom = 618
    const top = bottom - height
    const right = width + left

    return [
        { x: left, y: top },
        { x: left, y: bottom },
        { x: right, y: bottom },
        { x: right, y: top },
    ]
})

const computedPointsString = computed(() => characterPoints.value.map(coordinate => `${coordinate.x} ${coordinate.y}`).join(' '))

const props = defineProps<{
    characterMode: 'idle' | 'skew' | 'gek'
    mousePosition: {
        x: number
        y: number
    } | null
}>()

let polygon: Polygon | undefined

const defaultFacePosition = computed(() => ({
    x: 280,
    y: 270,
}))

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
