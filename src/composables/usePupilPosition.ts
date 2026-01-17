import { computed, type Ref } from 'vue'
import type { Position } from './useFacePosition'

export interface PupilPositionOptions {
    faceCoordinates: Ref<Position>
    maxOffset?: number
    mousePosition: Ref<Position | null>
    sensitivity?: number
}

export function usePupilPosition(options: PupilPositionOptions) {
    const {
        mousePosition,
        faceCoordinates,
        maxOffset = 4,
        sensitivity = 300,
    } = options

    const pupilPosition = computed(() => {
        if (!mousePosition.value) {
            return { x: 0, y: 0 }
        }

        const offsetX = mousePosition.value.x - faceCoordinates.value.x
        const offsetY = mousePosition.value.y - faceCoordinates.value.y

        const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY)

        if (distance === 0) {
            return { x: 0, y: 0 }
        }

        const scale = Math.min(1, distance / sensitivity)

        const normalizedX = offsetX / distance
        const normalizedY = offsetY / distance

        return {
            x: normalizedX * maxOffset * scale,
            y: normalizedY * maxOffset * scale,
        }
    })

    const pupilTransform = computed(
        () => `translate(${pupilPosition.value.x},${pupilPosition.value.y})`,
    )

    return {
        pupilPosition,
        pupilTransform,
    }
}
