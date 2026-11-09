import { useAnimationTick } from "@opentui/react";
import { useState } from "react";

import { MODEL_TRACK } from "../data/installTools";

function ModelMarquee({ width }: { width: number }) {
    const [offset, setOffset] = useState(0);
    const repeatedTrack = MODEL_TRACK.repeat(
        Math.ceil(width / MODEL_TRACK.length) + 1,
    );

    useAnimationTick(7, () => {
        setOffset((current) => (current + 1) % MODEL_TRACK.length);
    });

    return <text fg="#48DCC3">{repeatedTrack.slice(offset, offset + width)}</text>;
}

export default ModelMarquee;
