import PropTypes from 'prop-types';
import AccProfileApp from '../../../../../../views/apps/profiles/account';

// ==============================|| PAGE ||============================== //

// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
export default function Page({ params }) {
  const { tab } = params;

  return <AccProfileApp tab={tab} />;
}

Page.propTypes = {
  params: PropTypes.any,
  tab: PropTypes.any
};

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const response = ['basic', 'personal'];

  return response.map((tab) => ({
    tab: tab
  }));
}
