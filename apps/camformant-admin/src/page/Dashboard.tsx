import DefaultLayout from '../Layout/DefaultLayout';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
const Dashboard = () => {
  return (
    <DefaultLayout>
        <Breadcrumb pageName="Dashboard" />
        <h2 className='w-full h-full flex justify-center items-center text-3xl font-bold'>Coming Soon...!</h2>
    </DefaultLayout>
  );
};

export default Dashboard;
