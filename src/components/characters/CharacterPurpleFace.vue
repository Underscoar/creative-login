<template>
    <g id="purple-face" class="face-wrap" :transform="faceTransform">
        <defs>
            <clipPath id="left-eye-clip">
                <circle
                    ref="leftClip"
                    class="clip-circle"
                    :class="{
                        'is-blinking': isBlinking,
                        'sad': characterState === 'sad'
                    }"
                    r="6"
                />
            </clipPath>
            <clipPath id="right-eye-clip">
                <circle
                    ref="rightClip"
                    class="clip-circle"
                    :class="{
                        'is-blinking': isBlinking,
                        'sad': characterState === 'sad'
                    }"
                    r="6"
                />
            </clipPath>
        </defs>

        <g id="left-eye" ref="leftEye" class="eye">
            <circle
                class="st1 eye-white"
                :class="{
                    'is-blinking': isBlinking,
                    'sad': characterState === 'sad'
                }"
                :r="faceOptions.eyeRadius"
            />
            <g class="pupil-wrap" :transform="pupilTransform">
                <circle
                    class="st0 pupil"
                    :class="{
                        'is-blinking': isBlinking,
                    }"
                    :r="faceOptions.pupilRadius"
                    clip-path="url(#left-eye-clip)"
                />
            </g>
        </g>

        <g
            id="right-eye"
            ref="rightEye"
            class="eye"
            :transform="`translate(${faceOptions.spacing},0)`"
        >
            <circle
                class="st1 eye-white"
                :class="{
                    'is-blinking': isBlinking,
                    'sad': characterState === 'sad'
                }"
                :r="faceOptions.eyeRadius"
            />
            <g class="pupil-wrap" :transform="pupilTransform">
                <circle
                    class="st0 pupil"
                    :class="{
                        'is-blinking': isBlinking,
                    }"
                    :r="faceOptions.pupilRadius"
                    clip-path="url(#right-eye-clip)"
                />
            </g>
        </g>

        <CharacterPurpleMouth />
    </g>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, toRef } from 'vue'
import { sleep } from '@/utils/sleep'
import { useFacePosition } from '@/composables/useFacePosition'
import { useCharacterStore } from '@/stores/useCharacterStore'
import { storeToRefs } from 'pinia'
import CharacterPurpleMouth from './CharacterPurpleMouth.vue'
import { watch } from 'vue'

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
    faceRotation: number
    transformPupils: {
        x: number
        y: number
    }
}>()

const leftEye = ref<SVGGElement>()
const rightEye = ref<SVGGElement>()
const leftClip = ref<SVGCircleElement>()
const rightClip = ref<SVGCircleElement>()

const isBlinking = ref(false)

// const { isTransitioning, faceTransform, pupilTransform } = useFacePosition({
//     mousePosition: toRef(props, 'mousePosition'),
//     defaultPosition: toRef(props, 'defaultPosition'),
// })

const faceTransform = computed(
    () => `translate(${props.faceCoordinates.x},${props.faceCoordinates.y}) rotate(${props.faceRotation})`,
)

const pupilTransform = computed(() => {
    return `translate(${props.transformPupils.x},${props.transformPupils.y})`
})

const eyeTransformX = computed(() => {
    if (characterState.value === 'sad') return 'scaleX(0.75)'

    return 'scaleX(1)'
})

onMounted(async () => {
    await sleep(20)
    setInterval(blink, 3500)
})

function round(n: number) { return Math.round(n * 1000) / 1000 }

async function blink() {
    if (leftEye.value && rightEye.value && leftClip.value && rightClip.value) {
        isBlinking.value = true

        await sleep(220)

        isBlinking.value = false
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

    &.is-blinking {
        transform: scaleY(0) scaleX(1);
    }
}

.eye-white {
    &.sad {
        transform: scaleY(1) scaleX(0.75);
    }

    &.sad.is-blinking {
        transform: scaleY(0) scaleX(0.75);
    }
}
</style>
