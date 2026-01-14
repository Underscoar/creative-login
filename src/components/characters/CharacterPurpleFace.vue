<template>
    <g id="face" :class="{ transitioning: isTransitioning }" :transform="faceTransform">
        <defs>
            <clipPath id="left-eye-clip">
                <circle ref="leftClip" class="clip-circle" r="6" />
            </clipPath>
            <clipPath id="right-eye-clip">
                <circle ref="rightClip" class="clip-circle" r="6" />
            </clipPath>
        </defs>

        <g id="left-eye" ref="leftEye" class="eye">
            <circle class="st1 eye-white" r="6" />
            <circle
                class="st0 pupil"
                :class="{ transitioning: isTransitioning }"
                r="3"
                :transform="pupilTransform"
                clip-path="url(#left-eye-clip)"
            />
        </g>

        <g
            id="right-eye"
            ref="rightEye"
            class="eye"
            transform="translate(50,0)"
        >
            <circle class="st1 eye-white" r="6" />
            <circle
                class="st0 pupil"
                :class="{ transitioning: isTransitioning }"
                r="3"
                :transform="pupilTransform"
                clip-path="url(#right-eye-clip)"
            />
        </g>
    </g>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, toRef } from 'vue'
import { sleep } from '@/utils/sleep'
import { useFacePosition } from '@/composables/useFacePosition'

const props = defineProps<{
    mousePosition: {
        x: number
        y: number
    } | null
    defaultPosition: {
        x: number
        y: number
    }
}>()

const leftEye = ref<SVGGElement>()
const rightEye = ref<SVGGElement>()
const leftClip = ref<SVGCircleElement>()
const rightClip = ref<SVGCircleElement>()

const { isTransitioning, faceTransform, pupilTransform } = useFacePosition({
    mousePosition: toRef(props, 'mousePosition'),
    defaultPosition: toRef(props, 'defaultPosition'),
})

onMounted(async () => {
    await sleep(20)
    setInterval(blink, 3500)
})

async function blink() {
    if (leftEye.value && rightEye.value && leftClip.value && rightClip.value) {
        const leftEyeWhite = leftEye.value.querySelector('.eye-white') as SVGCircleElement
        const rightEyeWhite = rightEye.value.querySelector('.eye-white') as SVGCircleElement

        leftEyeWhite!.style.transform = 'scaleY(0)'
        rightEyeWhite!.style.transform = 'scaleY(0)'
        leftClip.value.style.transform = 'scaleY(0)'
        rightClip.value.style.transform = 'scaleY(0)'

        await sleep(220)

        leftEyeWhite!.style.transform = 'none'
        rightEyeWhite!.style.transform = 'none'
        leftClip.value.style.transform = 'none'
        rightClip.value.style.transform = 'none'
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

.eye-white,
.clip-circle {
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
