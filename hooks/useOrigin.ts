import useMounted from "@/hooks/useMounted";
const useOrigin = ()=>{
    const [isMounted, ] = useMounted();

    // The origin property returns the protocol, hostname and port number of a URL. The origin property is read-only.
    const origin = typeof window !== 'undefined' && window.location.origin? window.location.origin:'';
    if(!isMounted) return "";
    return origin;
}
export default useOrigin;
