// custom hook for auto-aborting an ongoing fetch
export const useAbortSignal = () => {
    const controller = useMemo(() => new AbortController(), [])
    useEffect(() => () => controller.abort(), [])
    return consroller.signal // returns a boolean
};
