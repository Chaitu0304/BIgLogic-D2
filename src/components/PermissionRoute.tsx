import { Navigate, Outlet } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from 'react';

interface PermissionRouteProps {
  requiredPermission: string;
}

const PermissionRoute = ({ requiredPermission }: PermissionRouteProps) => {
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isCompanyAdmin = user.role === 'company_admin' || user.role === 'superadmin';
  const hasPermission = user.permissions?.[requiredPermission] === true;

  useEffect(() => {
    if (!isCompanyAdmin && !hasPermission) {
      toast({
        title: "Access Denied",
        description: `You do not have permission to access the ${requiredPermission.replace(/([A-Z])/g, ' $1').trim()} module.`,
        variant: "destructive",
      });
    }
  }, [isCompanyAdmin, hasPermission, requiredPermission, toast]);

  if (isCompanyAdmin || hasPermission) {
    return <Outlet />;
  }

  return <Navigate to="/dashboard" replace />;
};

export default PermissionRoute;
