<template>
    <g id="face" :transform="faceTransform">
        <g id="left-eye" ref="leftEye" class="eye">
            <circle class="st1 eye-white" :r="faceOptions.eyeRadius" />
            <circle
                class="st0 pupil"
                :r="faceOptions.pupilRadius"
                :transform="pupilTransform"
            />
        </g>

        <g
            id="right-eye"
            ref="rightEye"
            class="eye"
            :transform="`translate(${faceOptions.spacing},0)`"
        >
            <circle class="st1 eye-white" :r="faceOptions.eyeRadius" />
            <circle
                class="st0 pupil"
                :r="faceOptions.pupilRadius"
                :transform="pupilTransform"
            />
        </g>

        <g id="eyelids">
            <circle class="st0" :r="faceOptions.eyeRadius * 2" :transform="`translate(${leftEyeLidX},${leftEyeLidY})`" />
            <circle class="st0" :r="faceOptions.eyeRadius * 2" :transform="`translate(${rightEyeLidX},${rightEyeLidY})`" />
        </g>
    </g>
</template>

<script lang="ts" setup>
import { onMounted, ref, toRef, computed, watch } from 'vue'
import { sleep } from '@/utils/sleep'
import { useFacePosition } from '@/composables/useFacePosition'
import { useCharacterStore } from '@/stores/useCharacterStore'
import { storeToRefs } from 'pinia'
import { useTransition, type UseTransitionOptions } from '@vueuse/core'
import { S } from 'vue-router/dist/router-CWoNjPRp.mjs'
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
        pupilRadius: number
        spacing: number
    }
    transformPupils: {
        x: number
        y: number
    }
}>()

const leftEye = ref<SVGGElement>()
const rightEye = ref<SVGGElement>()

const faceTransform = computed(
    () => `translate(${computedFacePosition.value.x},${computedFacePosition.value.y}) rotate(${0}, ${0}, 0)`,
)

const pupilTransform = computed(() => {
    return `translate(${computedPupilPosition.value.x},${computedPupilPosition.value.y})`
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

const faceConstraints = computed(() => ({
    x: 20,
    y: 20,
}))

const computedFacePosition = computed(() => {
    const clamp = (value: number, min: number, max: number) =>
        Math.max(min, Math.min(max, value))

    const offsetX = trackerPosition.value.x - props.faceCoordinates.x
    const offsetY = trackerPosition.value.y - props.faceCoordinates.y

    const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY)

    const maxDistance = 5000
    const scale = Math.min(1, Math.sqrt(distance / maxDistance))

    const scaledOffsetX = offsetX * scale
    const scaledOffsetY = offsetY * scale

    return {
        x: clamp(
            props.faceCoordinates.x + scaledOffsetX,
            props.faceCoordinates.x - faceConstraints.value.x,
            props.faceCoordinates.x + faceConstraints.value.x,
        ),
        y: clamp(
            props.faceCoordinates.y + scaledOffsetY,
            props.faceCoordinates.y - faceConstraints.value.y,
            props.faceCoordinates.y + faceConstraints.value.y,
        ),
    }
})

const computedPupilPosition = computed(() => {
    const offsetX = trackerPosition.value.x - props.faceCoordinates.x
    const offsetY = trackerPosition.value.y - props.faceCoordinates.y

    const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY)

    if (distance === 0) {
        return { x: 0, y: 0 }
    }

    const sensitivity = 300
    const scale = Math.min(1, distance / sensitivity)

    const normalizedX = offsetX / distance
    const normalizedY = offsetY / distance

    const maxOffset = 4

    return {
        x: normalizedX * maxOffset * scale,
        y: normalizedY * maxOffset * scale,
    }
})

onMounted(async () => {
    await sleep(500)
    setInterval(blink, 3000)
})

const idleEyelids = computed(() => {
    return {
        left: {
            x: -20,
            y: -15,
        },
        right: {
            x: 50,
            y: -15,
        },
    }
})

const sadEyelids = computed(() => {
    return {
        left: {
            x: -12,
            y: -15,
        },
        right: {
            x: 43,
            y: -15,
        },
    }
})

const eyelidPosition = computed(() => {
    if (characterState.value === 'sad') {
        return sadEyelids.value
    }
    return idleEyelids.value
})

const transitionOptions = computed<UseTransitionOptions>(() => {
    const delay = characterState.value === 'sad' ? 100 : 0
    return {
        duration: 500,
        transition: [0.3, 0.22, 0.16, 1],
        delay,
    }
})

const leftEyeLidX = useTransition(() => eyelidPosition.value.left.x, transitionOptions.value)
const leftEyeLidY = useTransition(() => eyelidPosition.value.left.y, transitionOptions.value)
const rightEyeLidX = useTransition(() => eyelidPosition.value.right.x, transitionOptions.value)
const rightEyeLidY = useTransition(() => eyelidPosition.value.right.y, transitionOptions.value)

async function blink() {
    if (leftEye.value && rightEye.value) {
        const leftEyeWhite = leftEye.value.querySelector('.eye-white') as SVGCircleElement
        const rightEyeWhite = rightEye.value.querySelector('.eye-white') as SVGCircleElement

        leftEyeWhite!.style.transform = 'scaleY(0)'
        rightEyeWhite!.style.transform = 'scaleY(0)'

        await sleep(220)

        leftEyeWhite!.style.transform = 'none'
        rightEyeWhite!.style.transform = 'none'
    }
}

function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
    // Precompute coefficients
    const cx = 3 * x1
    const bx = 3 * (x2 - x1) - cx
    const ax = 1 - cx - bx

    const cy = 3 * y1
    const by = 3 * (y2 - y1) - cy
    const ay = 1 - cy - by

    function sampleCurveX(t: number) {
        return ((ax * t + bx) * t + cx) * t
    }

    function sampleCurveY(t: number) {
        return ((ay * t + by) * t + cy) * t
    }

    function sampleCurveDerivativeX(t: number) {
        return (3 * ax * t + 2 * bx) * t + cx
    }

    // Solve x for t using Newton–Raphson
    function solveCurveX(x: number) {
        let t = x
        for (let i = 0; i < 5; i++) {
            const dx = sampleCurveX(t) - x
            if (Math.abs(dx) < 1e-6) return t
            const d = sampleCurveDerivativeX(t)
            if (Math.abs(d) < 1e-6) break
            t -= dx / d
        }
        return t
    }

    return (x: number) => sampleCurveY(solveCurveX(x))
}

function animateRef(
    refValue: Ref<number>,
    to: number,
    {
        duration = 500,
        easing = cubicBezier(0.25, 0.1, 0.25, 1),
        onComplete,
    }: {
        duration?: number
        easing?: (t: number) => number
        onComplete?: () => void
    } = {},
) {
    const from = refValue.value
    const start = performance.now()

    let rafId: number | null = null
    let finished = false

    function frame(now: number) {
        const elapsed = now - start
        const t = Math.min(elapsed / duration, 1)
        const eased = easing(t)

        refValue.value = from + (to - from) * eased

        if (t < 1) {
            rafId = requestAnimationFrame(frame)
        }
        else if (!finished) {
            finished = true
            onComplete?.()
        }
    }

    rafId = requestAnimationFrame(frame)

    return {
        cancel() {
            if (rafId !== null) {
                cancelAnimationFrame(rafId)
                rafId = null
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.st0 {
    fill: #1b1d21;
}

.st1 {
    fill: #fff;
}

.st2 {
    fill: red;
}

.eye-white {
    transform-origin: center;
    transform-box: fill-box;
    transition: transform 0.2s ease;
}

#face.transitioning {
    // transition: transform 0.3s cubic-bezier(.24,.02,.02,.97);
}

.pupil.transitioning {
    // transition: transform 0.3s cubic-bezier(.24,.02,.02,.97);
}
</style>
