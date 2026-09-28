import Head from 'next/head'
import About from '../components/About'
import Contact from '../components/Contact'
import Main from '../components/Main'
import Projects from '../components/Projects'
import Skills from '../components/Skills'
import Experience from '../components/Experience'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Sanjay Deoram</title>
        <meta name="description" content="Software Developer Bridging Technology with Business Needs" />
        <link rel="icon" href="assets/bdog.jpg" />
      </Head>
    <Main />
    <About />
    <Experience/>
    <Skills />
    <Projects />
    <Contact />
    </div>
  )
}
