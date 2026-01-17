<template>
    <g id="face" :class="{ transitioning: isTransitioning }" :transform="faceTransform">
        <g id="left-eye" ref="leftEye" class="eye">
            <circle class="st1 eye-white" :r="faceOptions.eyeRadius" />
            <circle
                class="st0 pupil"
                :class="{ transitioning: isTransitioning }"
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
                :class="{ transitioning: isTransitioning }"
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
}>()

const leftEye = ref<SVGGElement>()
const rightEye = ref<SVGGElement>()

const { isTransitioning, faceTransform, pupilTransform } = useFacePosition({
    mousePosition: toRef(props, 'mousePosition'),
    faceCoordinates: toRef(props, 'faceCoordinates'),
    faceSpacing: props.faceOptions.spacing,
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
    transition: transform 0.3s cubic-bezier(.24,.02,.02,.97);
}

.pupil.transitioning {
    transition: transform 0.3s cubic-bezier(.24,.02,.02,.97);
}
</style>
