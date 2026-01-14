<template>
    <g id="face" :class="{ transitioning: isTransitioning }" :transform="faceTransform">
        <g id="left-eye" ref="leftEye" class="eye">
            <circle class="st1 eye-white" r="8" />
            <circle
                class="st0 pupil"
                :class="{ transitioning: isTransitioning }"
                r="4"
                :transform="pupilTransform"
            />
        </g>

        <g
            id="right-eye"
            ref="rightEye"
            class="eye"
            transform="translate(30,0)"
        >
            <circle class="st1 eye-white" r="8" />
            <circle
                class="st0 pupil"
                :class="{ transitioning: isTransitioning }"
                r="4"
                :transform="pupilTransform"
            />
        </g>
    </g>
</template>

<script lang="ts" setup>
import { onMounted, ref, toRef } from 'vue'
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

const { isTransitioning, faceTransform, pupilTransform } = useFacePosition({
    mousePosition: toRef(props, 'mousePosition'),
    defaultPosition: toRef(props, 'defaultPosition'),
})

onMounted(async () => {
    await sleep(500)
    setInterval(blink, 3000)
})

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
