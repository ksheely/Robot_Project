import {Switch, Route, Router} from "wouter"
import CreateAuth from "./pages/Auth"
import Home from "./pages/Home"
import About from "./pages/About"
import CurrentJobs from "./pages/CurrentJobs"
import Login from "./pages/Login"
import SendMessage from "./pages/SendMessage"
import CreateUser from "./components/containers/CreateUser"

const Routes = () => {
    return (
       <Router>
            <Switch>
                <Route path="/Home" component={Home}/>
                <Route path="/About" component={About}/>
                <Route path="/Current-jobs" component={CurrentJobs}/>
                <Route path="/Login" component={Login}/>
                <Route path="/Send-Message" component={SendMessage}/>
                <Route path="/Create-Account" component={CreateUser}/>

            </Switch>
        </Router>

    )




}
export default Routes