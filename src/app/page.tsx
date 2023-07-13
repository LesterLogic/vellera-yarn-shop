
import Tile from '../components/tile';

export default function Home() {
  return (
    <main className="flex flex-col sm:flex-row flex-wrap items-start justify-around">
      <Tile background="bg-yarn-tile" header="Shop Yarn" subheader="Craft your masterpiece with our premium yarns." url="/" />
      <Tile background="bg-patterns-tile" header="Shop Patterns" subheader="Discover your next cozy creation with our patterns." url="/" />
      <Tile background="bg-tools-tile" header="Shop Tools" subheader="Unleash creativity with premium tools." url="/" />
      <Tile background="bg-learning-tile" header="Learning Center" subheader="Nurture your creativity and improve your knitting." url="/" />
    </main>
  )
}
