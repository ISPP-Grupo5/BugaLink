import Faq from '../components/Faq';
import Features from '../components/Features';
import Hero from '../components/Hero';
import Layout from '../components/Layout';
import Separator from '../components/Separator';

export default function IndexPage() {
  return (
    <Layout>
      <Hero />
      <Separator id="features" className={'fill-secondary'} />
      <Features />
      <Separator id="faq" className={'bg-black fill-white'} />
      <Faq />
    </Layout>
  );
}
