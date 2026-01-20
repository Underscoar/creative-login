import { computed, type Ref, type ComputedRef } from 'vue'

export function useCharacterOrangeStates(headPosX: Ref<number> | ComputedRef<number>, headPosY: Ref<number> | ComputedRef<number>) {
    const frameOptions = computed(() => ({
        width: 660,
        height: 800,
        floor: 618,
    }))

    const basePosition = computed(() => ({
        left: 100,
    }))

    // NOTE: Anchor of the face is the center of the left (character's right) eye
    const faceOptions = computed(() => ({
        eyeRadius: 5,
        spacing: 45,
        mouthRadius: 5,
    }))

    const idle = computed(() => {
        const height = 200
        const width = 275

        // Base height for the curve handles
        const baseHeight = 150
        // How much the height changes when looking left/right (tilt amount)
        const tiltAmount = 20
        // Extra height when facing center (simulates 3D depth)
        const centerBoost = 30
        // How much vertical mouse movement affects height
        const verticalInfluence = 30

        // Normalize headPosX to -1 to 1 range
        const normalizedX = headPosX.value / 300
        // Normalize headPosY to -1 to 1 range
        const normalizedY = headPosY.value / 100

        // Height boost: maximum at center (0), zero at edges (-1 or 1)
        // Uses 1 - x² for a smooth falloff
        const depthBoost = centerBoost * (1 - normalizedX * normalizedX)

        // Vertical boost: looking up (negative Y) makes curve taller, looking down makes it shorter
        const verticalBoost = -normalizedY * verticalInfluence

        // Horizontal shift for both handles
        const horizontalShift = normalizedX * 100

        // When looking left (negative), right side lowers, left side rises
        // When looking right (positive), left side lowers, right side rises
        // Both handles also get the depth boost when near center
        const leftHandleX = horizontalShift
        const leftHandleY = baseHeight + depthBoost + verticalBoost - (normalizedX * tiltAmount)
        const rightHandleX = horizontalShift
        const rightHandleY = baseHeight + depthBoost + verticalBoost + (normalizedX * tiltAmount)

        const characterSVGData = {
            name: 'characterSmileCurve',
            class: 'st-orange',
            closed: false,
            start: { x: basePosition.value.left, y: frameOptions.value.floor },
            segments: [
                {
                    type: 'cubic',
                    handle1: { dx: 0 + leftHandleX, dy: -leftHandleY },
                    handle2: { dx: width + rightHandleX, dy: -rightHandleY },
                    end: { dx: width, dy: 0 },
                },
            ],
        }
        const faceWidth = (faceOptions.value.eyeRadius * 2) + faceOptions.value.spacing
        const anchorPosition = getTopLeftAnchorCoordinates(height)

        const centerOfFaceXCoordinate = anchorPosition.x + (width / 2)
        const centerOfFaceYCoordinate = anchorPosition.y + 150

        const facePositionX = centerOfFaceXCoordinate - ((faceWidth / 2) - faceOptions.value.eyeRadius)
        const facePositionY = centerOfFaceYCoordinate - faceOptions.value.eyeRadius

        return {
            width: width,
            height: height,
            allowMouseFollow: true,
            skew: 0,
            centerOfFaceCoordinates: {
                x: centerOfFaceXCoordinate,
                y: centerOfFaceYCoordinate,
            },
            faceCoordinates: {
                x: facePositionX,
                y: facePositionY,
            },
            faceWidth: faceWidth,
            faceRotation: 0,
            characterSVGData,
        }
    })

    function getTopLeftAnchorCoordinates(height: number) {
        const x = basePosition.value.left
        const y = frameOptions.value.floor - height

        return { x, y }
    }

    return {
        basePosition,
        faceOptions,
        idle,
    }
}
