import Layout from '../components/Layout'
import Card from '../components/Card'

const Home = () => {
    return (
        <Layout home>
            <main className="container mx-auto flex flex-col items-center justify-center h-full p-4">
                <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
                    SRM
                </h1>
                <div className="grid gap-3 pt-3 mt-3 text-center md:grid-cols-3 lg:w-2/3">
                    <Card
                        name="Start a Race"
                        description="5, 4, 1, GO!"
                        link="/About#Start"
                    />
                    <Card
                        name="Record Results"
                        description="Instant calculation"
                        link="/About#Results"
                    />
                    <Card
                        name="Calculate Series"
                        description="How to run races"
                        link="/About#Series"
                    />
                </div>
                <p>
                    Flashy pictures with boats and results
                </p>
            </main>
    </Layout>
  );
};


export default Home;
