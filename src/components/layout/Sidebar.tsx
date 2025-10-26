import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Home,
  Upload,
  Activity,
  Search,
  Phone,
  CheckSquare,
  Settings,
  X,
  LogOut,
  User,
  Shield,
  Plus,
  List
} from "lucide-react";
import logo from "@/assets/logo.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";

const navigation = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Create Poll", href: "/create_poll", icon: Plus },
  { name: "Polls", href: "/polls", icon: List },
  { name: "Profile", href: "/profile", icon: User },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { user, logout } = useAuth();

  console.log(user);

  return (
    <div className="flex flex-col h-full w-64 bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center justify-center py-4 border-b border-border">
        <Image src={logo} alt="QuickPoll" width={80} height={80} />
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <Link key={item.href} href={item.href} onClick={onClose}>
            <div className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-accent">
              <item.icon className="size-5 mr-3" />
              <span>{item.name}</span>
            </div>
          </Link>
        ))}
      </nav>

      {/* User info and logout */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center px-3 py-2 mb-2">
          <User className="size-4 mr-3 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.email}</p>
          </div>
        </div>
        <Separator className="my-2" />
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <LogOut className="size-4 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
};