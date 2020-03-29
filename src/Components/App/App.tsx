import React, { PureComponent } from "react";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import LandingBody from "../LandingBody/LandingBody";
import NewReport from "../Report/newReport";
import Report from "../Report/Report";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Profesionals from "../Profesionals/Profesionals";
import Upload from "../Drive/Upload";
import Pictures from "../Drive/Pictures";

const AnimatedSwitch = withRouter(({ location }) => (
  <TransitionGroup>
    <CSSTransition key={location.key} classNames="fade" timeout={500}>
      <Switch location={location}>
        <Route path="/profesionals" exact component={Profesionals} />
        <Route path="/newReport/:id_property_details" component={NewReport} />
        <Route path="/report/:id_report" component={Report} />
      </Switch>
    </CSSTransition>
  </TransitionGroup>
));

//  TODO check rutas

class App extends PureComponent {
  render() {
    return (
      <>
        <div className="App">
          <BrowserRouter>
            <Switch>
              <Route path="/" exact component={LandingBody} />
              <Route path="/drive/pictures" exact component={Pictures} />
              <Route path="/drive/upload" exact component={Upload} />
            </Switch>
            <Switch>
              <AnimatedSwitch />
            </Switch>
          </BrowserRouter>
        </div>
      </>
    );
  }
}
export default App;
