import "./Nav.css";
import logo from "../../../assets/mnsu-logo.png";
import RouteLink from "../RouteLink";
import { useAtomValue } from "jotai";
import { isUserLoggedInAtom } from "../../../data/atoms/isUserLoggedIn";


const Nav = ({ }) => {
  const currentUser = useAtomValue(isUserLoggedInAtom)

  return (
  <nav className="bg-violet-400 fixed w-full z-20 top-0 start-0 border-b border-default">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <img src={logo} className="h-7" alt="MNSU logo" />
        {/* <span className="self-center text-xl text-heading font-semibold whitespace-nowrap">Robobite</span> */}
        <RouteLink text="Robobite" href="/home" />
    </div>
    <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary" aria-controls="navbar-default" aria-expanded="false">
        <span className="sr-only">Open main menu</span>
        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"/></svg>
    </button>
    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
      <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-primary">
        <li>
          <RouteLink text="Home" href="/home" />
        </li>
        <li>
          <RouteLink text="About" href="/about" />
        </li>
        <li>
          <RouteLink text="Current Jobs" href="/currrent-jobs" /> 
        </li>
        
        {currentUser
          ?(
          <>
            <li>
              <RouteLink text="Send Message" href="/send-message" />
            </li>
            <li>
              <RouteLink text="Logout" navigateTo="/home" />
            </li>
          </>
          ) 
          : (
          <>
            <li>
              <RouteLink text="Login" href="/login" />
            </li>
            <li>
              <RouteLink text="Create Account" href="/create-account" />
            </li>
          </>
          )
        }
      </ul>
    </div>
  </div>
</nav>
)
}
export default Nav;
