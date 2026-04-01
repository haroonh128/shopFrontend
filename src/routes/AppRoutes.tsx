    import PublicRoutes from './PublicRoutes';
    import ProtectedRoutes from './ProtectedRoutes';
    export default function AppRoutes(){
    return (    
    <>
    <PublicRoutes />
    <ProtectedRoutes />
    </>
    );
}