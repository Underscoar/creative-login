<template>
    <g id="face" :transform="faceTransform">
        <g id="left-eye" ref="leftEye" class="eye">
            <circle class="st0 eye" :r="faceOptions.eyeRadius" />
        </g>

        <g
            id="right-eye"
            ref="rightEye"
            class="eye"
            :transform="`translate(${faceOptions.spacing},0)`"
        >
            <circle class="st0 eye" :r="faceOptions.eyeRadius" />
        </g>

        <CharacterOrangeMouth :face-options="faceOptions" :face-width="faceWidth" />
    </g>
</template>

<script lang="ts" setup>
import { onMounted, ref, toRef, computed, watch } from 'vue'
import { sleep } from '@/utils/sleep'
import { useFacePosition } from '@/composables/useFacePosition'
import { useCharacterStore } from '@/stores/useCharacterStore'
import { storeToRefs } from 'pinia'
import { useTransition, type UseTransitionOptions } from '@vueuse/core'
import CharacterOrangeMouth from './CharacterOrangeMouth.vue'
import type { Ref } from 'vue'

const characterStore = useCharacterStore()
const { characterState } = storeToRefs(characterStore)

const props = defineProps<{
    mousePosition: {
        x: number
        y: number
    } | null
    faceCoordinates: {
        x: number
        y: number
    }
    faceOptions: {
        eyeRadius: number
        spacing: number
        mouthRadius: number
    }
    faceWidth: number
}>()

const leftEye = ref<SVGGElement>()
const rightEye = ref<SVGGElement>()

const faceTransform = computed(
    () => `translate(${computedFacePosition.value.x},${computedFacePosition.value.y}) rotate(${0}, ${0}, 0)`,
)

const mouthTransform = computed(() => {
    return `translate(${(props.faceWidth / 2) - props.faceOptions.mouthRadius},${8})`
})

const trackerPosition = computed(() => ({
    x: virtualTrackerX.value,
    y: virtualTrackerY.value,
}))

const virtualTrackerX = ref(props.faceCoordinates.x)
const virtualTrackerY = ref(props.faceCoordinates.y)

watch(() => props.mousePosition, async (newVal, oldVal) => {
    if (newVal === null || characterState.value !== 'idle') {
        virtualTrackerX.value = props.faceCoordinates.x
        virtualTrackerY.value = props.faceCoordinates.y
    }
    else {
        virtualTrackerX.value = newVal.x
        virtualTrackerY.value = newVal.y
    }
})

const faceConstraintRadius = 75

const computedFacePosition = computed(() => {
    const offsetX = trackerPosition.value.x - props.faceCoordinates.x
    const offsetY = trackerPosition.value.y - props.faceCoordinates.y

    const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY)

    const maxDistance = 5000
    const scale = Math.min(1, Math.sqrt(distance / maxDistance))

    const scaledOffsetX = offsetX * scale
    const scaledOffsetY = offsetY * scale

    const scaledDistance = Math.sqrt(scaledOffsetX * scaledOffsetX + scaledOffsetY * scaledOffsetY)

    // Circle constraint: if outside radius, normalize to the edge
    if (scaledDistance > faceConstraintRadius) {
        const normalizedX = scaledOffsetX / scaledDistance
        const normalizedY = scaledOffsetY / scaledDistance
        return {
            x: props.faceCoordinates.x + normalizedX * faceConstraintRadius,
            y: props.faceCoordinates.y + normalizedY * faceConstraintRadius,
        }
    }

    return {
        x: props.faceCoordinates.x + scaledOffsetX,
        y: props.faceCoordinates.y + scaledOffsetY,
    }
})

onMounted(async () => {
    await sleep(500)
    setInterval(blink, 3500)
})

const transitionOptions = computed<UseTransitionOptions>(() => {
    const delay = characterState.value === 'sad' ? 100 : 0
    return {
        duration: 500,
        transition: [0.3, 0.22, 0.16, 1],
        delay,
    }
})

async function blink() {
    if (leftEye.value && rightEye.value) {
        const leftEyeEl = leftEye.value.querySelector('.eye') as SVGCircleElement
        const rightEyeEl = rightEye.value.querySelector('.eye') as SVGCircleElement

        leftEyeEl!.style.transform = 'scaleY(0)'
        rightEyeEl!.style.transform = 'scaleY(0)'

        await sleep(300)

        leftEyeEl!.style.transform = 'none'
        rightEyeEl!.style.transform = 'none'
    }
}

</script>

<style lang="scss" scoped>
.st0 {
    fill: #1b1d21;
}

.eye {
    transform-origin: center;
    transform-box: fill-box;
    transition: transform 0.2s ease;
}
</style>
