import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import SignUp from './pages/SignUp.jsx'
import SignIn from './pages/SignIn.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Projects from './pages/Projects.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute.jsx'
import CreateFacility from './pages/CreateFacility.jsx'
import UpdateFacility from './pages/UpdateFacility.jsx'
import ResetOnNavigate from "./components/ResetOnNavigate";
import FacilityPage from './pages/FacilityPage.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Search from './pages/Search.jsx'


export default function App() {
	return (
		<BrowserRouter>
			<ScrollToTop />
			<ResetOnNavigate>
				<div className="min-h-screen flex flex-col">
					<Header />
					<Routes>
						<Route path='/' element={<Home />}></Route>
						<Route path='/about' element={<About />}></Route>
						<Route path='/sign-up' element={<SignUp />}></Route>
						<Route path='/sign-in' element={<SignIn />}></Route>
						<Route path='/search' element={<Search />}></Route>
						<Route element={<PrivateRoute />}>
							<Route path='/dashboard' element={<Dashboard />}></Route>
						</Route>
						<Route path='/projects' element={<Projects />}></Route>
						<Route path='/facility/:facilitySlug' element={<FacilityPage />}></Route>
						<Route path='/create-facility' element={<CreateFacility />}></Route>
						<Route path='/update-facility/:facilitySlug' element={<UpdateFacility />}></Route>
						{/* <Route element={<OnlyAdminPrivateRoute />}>
							
						</Route> */}
					</Routes>
				</div>
				<Footer />
			</ResetOnNavigate>
		</BrowserRouter>
	)
}