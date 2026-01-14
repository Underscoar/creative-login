import { ref, computed, watch, type Ref } from 'vue'
import { usePupilPosition } from './usePupilPosition'

export interface Position {
    x: number
    y: number
}

export interface FacePositionOptions {
    defaultPosition: Ref<Position>
    faceConstraints?: Ref<Position>
    maxPupilOffset?: number
    maxRotation?: number
    mousePosition: Ref<Position | null>
    pupilSensitivity?: number
    rotationScale?: number
}

export function useFacePosition(options: FacePositionOptions) {
    const {
        mousePosition,
        defaultPosition,
        faceConstraints = ref({ x: 20, y: 20 }),
        maxPupilOffset = 4,
        pupilSensitivity = 300,
        maxRotation = 8,
        rotationScale = 200,
    } = options

    const { pupilPosition, pupilTransform } = usePupilPosition({
        mousePosition,
        defaultPosition,
        maxOffset: maxPupilOffset,
        sensitivity: pupilSensitivity,
    })

    const isTransitioning = ref(false)
    let transitionTimeout: ReturnType<typeof setTimeout> | null = null

    watch(mousePosition, (newVal, oldVal) => {
        const wasInside = oldVal !== null
        const isInside = newVal !== null

        if (wasInside !== isInside) {
            isTransitioning.value = true

            if (transitionTimeout) {
                clearTimeout(transitionTimeout)
            }

            transitionTimeout = setTimeout(() => {
                isTransitioning.value = false
            }, 300)
        }
    })

    const facePosition = computed(() => {
        if (!mousePosition.value) {
            return defaultPosition.value
        }

        const clamp = (value: number, min: number, max: number) =>
            Math.max(min, Math.min(max, value))

        const offsetX = mousePosition.value.x - defaultPosition.value.x
        const offsetY = mousePosition.value.y - defaultPosition.value.y

        const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY)

        const maxDistance = 5000
        const scale = Math.min(1, Math.sqrt(distance / maxDistance))

        const scaledOffsetX = offsetX * scale
        const scaledOffsetY = offsetY * scale

        return {
            x: clamp(
                defaultPosition.value.x + scaledOffsetX,
                defaultPosition.value.x - faceConstraints.value.x,
                defaultPosition.value.x + faceConstraints.value.x,
            ),
            y: clamp(
                defaultPosition.value.y + scaledOffsetY,
                defaultPosition.value.y - faceConstraints.value.y,
                defaultPosition.value.y + faceConstraints.value.y,
            ),
        }
    })

    const faceRotation = computed(() => {
        if (!mousePosition.value) {
            return 0
        }

        const offsetX = mousePosition.value.x - defaultPosition.value.x
        return (offsetX / rotationScale) * maxRotation * -1
    })

    const faceTransform = computed(
        () => `translate(${facePosition.value.x},${facePosition.value.y}) rotate(${faceRotation.value})`,
    )

    return {
        isTransitioning,
        facePosition,
        faceRotation,
        faceTransform,
        pupilPosition,
        pupilTransform,
    }
}
