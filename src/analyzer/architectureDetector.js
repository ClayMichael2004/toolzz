export const detectArchitecture = (scanResult) => {

    const folders = scanResult.folders.map(folder => folder.toLowerCase());

    const has = (name) => folders.includes(name.toLowerCase());

    const result = {
        architecture: "Unknown",
        confidence: 0,
        reasons: []
    };

    // MVC
    if (
        has("controllers") &&
        has("models") &&
        has("routes")
    ) {
        result.architecture = "MVC";
        result.confidence = 95;
        result.reasons.push(
            "Detected controllers, models and routes folders."
        );

        if (has("services")) {
            result.confidence += 3;
            result.reasons.push(
                "Services layer detected."
            );
        }

        return result;
    }

    // Feature-Based
    if (has("features")) {
        result.architecture = "Feature-Based";
        result.confidence = 95;
        result.reasons.push(
            "Features directory detected."
        );
        return result;
    }

    // Clean Architecture
    if (
        has("domain") &&
        has("application") &&
        has("infrastructure")
    ) {
        result.architecture = "Clean Architecture";
        result.confidence = 98;
        result.reasons.push(
            "Domain, application and infrastructure folders detected."
        );
        return result;
    }

    return result;
};