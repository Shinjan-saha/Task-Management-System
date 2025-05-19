
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Check, List, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAuthenticated, removeToken } from "@/services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, []);

  const handleLogout = () => {
    removeToken();
    setIsAuth(false);
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Check className="h-6 w-6 text-primary mr-2" />
              <span className="text-xl font-bold">TaskFlow</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuth ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/tasks')}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-1"
                  onClick={() => navigate('/tasks/new')}
                >
                  <Plus className="h-4 w-4" />
                  New Task
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                >
                  Login
                </Button>
                <Button 
                  onClick={() => {
                    navigate('/');
                    setTimeout(() => {
                      const authForm = document.querySelector('button[variant="link"]');
                      if (authForm) (authForm as HTMLButtonElement).click();
                    }, 100);
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-gray-500 hover:text-gray-700"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <List className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            {isAuth ? (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate('/tasks');
                    setMobileMenuOpen(false);
                  }}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start flex items-center gap-1"
                  onClick={() => {
                    navigate('/tasks/new');
                    setMobileMenuOpen(false);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  New Task
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full justify-start"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    navigate('/');
                    setMobileMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button 
                  className="w-full justify-start"
                  onClick={() => {
                    navigate('/');
                    setMobileMenuOpen(false);
                    setTimeout(() => {
                      const authForm = document.querySelector('button[variant="link"]');
                      if (authForm) (authForm as HTMLButtonElement).click();
                    }, 100);
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
