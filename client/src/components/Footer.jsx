import { Footer, FooterTitle, FooterLinkGroup, FooterLink, FooterDivider, FooterCopyright } from "flowbite-react"
import { Link } from "react-router-dom"

export default function FooterComp() {
    return (
        <Footer container className="flex flex-col border border-t-8 border-teal-500">
            <div className="w-full max-w-7xl mx-auto">
                <div className="flex flex-col w-full justify-between sm:flex-row">
                    <div className="mt-3">
                        <Link to='/' className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
                            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Quick</span>
                            Court
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mt-6 sm:grid-cols-3 sm:gap-6">
                        <div>
                            <FooterTitle title='About' />
                            <FooterLinkGroup col>
                                <FooterLink as={Link} to="/about" target="_blank" rel="noopener noreferer">
                                    About the project
                                </FooterLink>
                                <FooterLink href="https://github.com/anubhav-m" target="_blank" rel="noopener noreferer">
                                    About the creator
                                </FooterLink>
                            </FooterLinkGroup>
                        </div>

                        <div>
                            <FooterTitle title='Follow Us' />
                            <FooterLinkGroup col>
                                <FooterLink href="https://github.com/anubhav-m/node-notion" target="_blank" rel="noopener noreferer">
                                    Github
                                </FooterLink>
                            </FooterLinkGroup>
                        </div>

                        <div>
                            <FooterTitle title='Legal' />
                            <FooterLinkGroup col>
                                <FooterLink as={Link} to="/#" target="_blank" rel="noopener noreferer">
                                    Privacy Policy
                                </FooterLink>
                                <FooterLink as={Link} to="/#" target="_blank" rel="noopener noreferer">
                                    Terms & Conditions
                                </FooterLink>
                            </FooterLinkGroup>
                        </div>
                    </div>
                </div>
            </div>

            <FooterDivider />
            <FooterCopyright
                href="https://github.com/anubhav-m"
                by='Made with ❤ by Anubhav Mishra'
                year={new Date().getFullYear()}
            />
        </Footer>
    )
}