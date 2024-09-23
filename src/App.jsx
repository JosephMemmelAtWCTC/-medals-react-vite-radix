import { useState, useEffect, useRef } from 'react'
import axios from "axios";
import NewCountry from './components/NewCountry';
import Country from './components/Country';
import { Theme, Button, Flex, Heading, Badge, Container } from '@radix-ui/themes';
import { SunIcon, MoonIcon } from '@radix-ui/react-icons';
import '@radix-ui/themes/styles.css';
import './App.css'

function App() {
  const API_ENDPOINT = "https://olympic-medals-daezewgjb4dxg6f9.canadacentral-01.azurewebsites.net/API/country";

  const [appearance, setAppearance] = useState("dark");
  const [countries, setCountries] = useState([]);
  const medals = useRef([
    { id: 1, name: 'gold', color: '#FFD700', rank: 1 },
    { id: 2, name: 'silver', color: '#C0C0C0', rank: 2 },
    { id: 3, name: 'bronze', color: '#CD7F32', rank: 3 },
  ]);

  const handleAdd = async (name, gold, silver, bronze) => {
    const { data: post } = await axios.post(API_ENDPOINT, {
      name: name,
      gold: gold ?? 0,
      silver: silver ?? 0,
      bronze: bronze ?? 0
    });
    setCountries([...countries].concat({ id: post.id, name: post.name, gold: post.gold, silver: post.silver, bronze: post.bronze }));
  };
  const handleDelete = async (countryId) => {
    const originalCountries = countries;
    setCountries(countries.filter((c) => c.id !== countryId));
    try {
      await axios.delete(`${API_ENDPOINT}/${countryId}`);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        // country already deleted
        console.log(
          "The record does not exist - it may have already been deleted"
        );
      } else {
        alert("An error occurred while deleting a country");
        setWords(originalCountries);
      }
    }
  };
  function handleIncrement(countryId, medalName) {
    const idx = countries.findIndex(c => c.id === countryId);
    const mutableCountries = [...countries];
    mutableCountries[idx][medalName] += 1;
    setCountries(mutableCountries);
  }
  function handleDecrement(countryId, medalName) {
    const idx = countries.findIndex(c => c.id === countryId);
    const mutableCountries = [...countries];
    mutableCountries[idx][medalName] -= 1;
    setCountries(mutableCountries);
  }
  function getAllMedalsTotal() {
    let sum = 0;
    medals.current.forEach(medal => { sum += countries.reduce((a, b) => a + b[medal.name], 0); });
    return sum;
  }
  function toggleAppearance() {
    setAppearance(appearance === "light" ? "dark" : "light");
  }

  // async function getData(url) {
  //   return fetch(url)
  //     .then(response => {
  //       // console.log("response", response)
  //       // response.json()
  //       return response.json();
  //     })
  //     .then(data => {
  //       console.log("data", data)
  //       return data;
  //     })
  //     .catch(error => {
  //       console.error('There has been a problem with your fetch operation:', error);
  //       return([]);
  //     });
  // }

  // this is the functional equivalent to componentDidMount
  useEffect(() => {
    // initial data loaded here
    // let fetchedCountries = [
    //   { id: 1, name: 'United States', gold: 2, silver: 2, bronze: 3 },
    //   { id: 2, name: 'China', gold: 3, silver: 1, bronze: 0 },
    //   { id: 3, name: 'Germany', gold: 0, silver: 2, bronze: 2 },
    //   { id: 4, name: 'France', gold: 2, silver: 2, bronze: 1 },
    //   { id: 5, name: 'Spain', gold: 1, silver: 1, bronze: 0 },
    //   { id: 6, name: 'United Kingdom', gold: 0, silver: 2, bronze: 3 },
    //   { id: 7, name: 'Brazil', gold: 3, silver: 0, bronze: 0 },
    //   { id: 8, name: 'Italy', gold: 2, silver: 2, bronze: 2 },
    //   { id: 9, name: 'Switzerland', gold: 1, silver: 1, bronze: 2 },
    //   { id: 10, name: 'Poland', gold: 0, silver: 2, bronze: 1 },
    //   { id: 11, name: 'Sweden', gold: 0, silver: 3, bronze: 1 },
    //   { id: 12, name: 'Ireland', gold: 2, silver: 1, bronze: 0 },
    //   { id: 13, name: 'Scotland', gold: 3, silver: 0, bronze: 2 },
    // ]
    // getData("https://olympic-medals-daezewgjb4dxg6f9.canadacentral-01.azurewebsites.net/API/country").then( fetchedCountries => {
    //   setCountries(fetchedCountries);
    // });

    async function fetchData() {
      const { data: fetchedCountries } = await axios.get(API_ENDPOINT);
      console.log("fetchedCountries",fetchedCountries)
      setCountries(fetchedCountries);
    }
    fetchData();

  }, []);

  return (
    <Theme appearance={appearance}>
      <Button onClick={toggleAppearance} style={{ position: "fixed", bottom: 20, right: 20, zIndex: 100 }} variant="ghost">
        {
          (appearance === "dark") ? <MoonIcon /> : <SunIcon />
        }
      </Button>
      <Flex p="2" pl="8" className="fixedHeader" justify="between">
        <Heading size="6">
          Olympic Medals
          <Badge variant="outline" ml="2">
            <Heading size="6">{getAllMedalsTotal()}</Heading>
          </Badge>
        </Heading>
        <NewCountry onAdd={handleAdd} />
      </Flex>
      <Container className="bg">
      </Container>
      <Flex wrap="wrap" justify="center">
        {
          countries.sort((a, b) => a.name.localeCompare(b.name)).map(country =>
            <Country
              key={country.id}
              country={country}
              medals={medals.current}
              onDelete={handleDelete}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
            />
          )
        }
      </Flex>
    </Theme>
  )
}

export default App