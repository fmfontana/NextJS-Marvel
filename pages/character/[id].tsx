import React, { useEffect, useState } from "react";
import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { Grid, Card, Text, Button, Container } from "@nextui-org/react";

import { marvelApi } from "../../api";
import { Layout } from "../../components/layouts";
import { MarvelCharacterResponse, Character } from "../../interfaces/marvelCharacterResponse.interface";
import { storageFavs } from "../../utils";
import { AxiosResponse } from "axios";

const CharacterPage: NextPage<{ character: Character }> = ({ character }) => {
	const [isInFavs, setInFavs] = useState(storageFavs.exists(character.id));

	const handleFav = () => {
		let characterImg = character.thumbnail.path + "." + character.thumbnail.extension;
		storageFavs.toogleFavs(character.id, characterImg);
		setInFavs(!isInFavs);
	};

	return (
		<Layout title={character.name}>
			<Grid.Container css={{ marginTop: "5px" }} gap={2}>
				<Grid xs={12} sm={4}>
					<Card isHoverable css={{ padding: "20px" }}>
						<Card.Body>
							<Card.Image
								src={character.thumbnail.path + "." + character.thumbnail.extension}
								alt={character.name}
								width="100%"
								height={200}
							/>
						</Card.Body>
					</Card>
				</Grid>

				<Grid xs={12} sm={8}>
					<Card>
						<Card.Header css={{ display: "flex", justifyContent: "space-between" }}>
							<Text h2 transform="capitalize">
								{character.name.toUpperCase()}
							</Text>

							<Button bordered ghost={isInFavs} css={{ fontSize: "19px" }} onPress={handleFav}>
								{isInFavs ? "MARKED AS FAVORITE" : "ADD TO FAVORITES"}
							</Button>
						</Card.Header>

						<Card.Body>
							<Text size={25}>COMICS:</Text>

							<Container direction="row" display="flex" gap={0}>
								<ul>
									{character.comics.items.map((comic) => (
										<li key={comic.resourceURI}>{comic.name.toUpperCase()}</li>
									))}
								</ul>
							</Container>

							<Text size={25}>SERIES:</Text>

							<Container direction="row" display="flex" gap={0}>
								<ul>
									{character.series.items.map((serie) => (
										<li key={serie.resourceURI}>{serie.name.toUpperCase()}</li>
									))}
								</ul>
							</Container>
						</Card.Body>
					</Card>
				</Grid>
			</Grid.Container>
		</Layout>
	);
};

export const getStaticPaths: GetStaticPaths = async (ctx) => {
	// Given the non-linear nature of the ids in the Marvel APIs there's no other way to hardcore them for SSG
	const characterIds = [
		"1011334",
		"1017100",
		"1009144",
		"1010699",
		"1009146",
		"1016823",
		"1009148",
		"1009149",
		"1010903",
		"1011266",
		"1010354",
		"1010846",
		"1017851",
		"1012717",
		"1011297",
		"1011031",
		"1009150",
		"1011198",
		"1011175",
		"1011136",
		"1011176",
		"1010870",
		"1011194",
		"1011170",
		"1009240",
		"1011120",
		"1010836",
		"1010755",
		"1011214",
		"1009497",
	];

	return {
		paths: characterIds.map((id) => ({
			params: { id },
		})),
		fallback: "blocking",
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { id } = params as { id: string };

	const {
		env: { MARVEL_API_TS = null, MARVEL_API_KEY = null, MARVEL_API_HASH = null },
	} = process;

	let reqdata: AxiosResponse<MarvelCharacterResponse> | null = null;

	try {
		reqdata = await marvelApi.get<MarvelCharacterResponse>(
			`/characters/${id}?ts=${MARVEL_API_TS}&apikey=${MARVEL_API_KEY}&hash=${MARVEL_API_HASH}&limit=30`
		);
	} catch (error) {
		reqdata = null;
	}

	if (!reqdata) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	return {
		props: {
			character: reqdata.data.data.results[0],
		},
		revalidate: 3600,
	};
};

export default CharacterPage;
