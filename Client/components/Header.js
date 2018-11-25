import Link from 'next/link'
import { withRouter } from 'next/router'

import ArtistSearch from '../components/ArtistSearch'

const Header = ({ router: { pathname } }) => (
  <header>
    <ArtistSearch />
  </header>
)

export default withRouter(Header)
