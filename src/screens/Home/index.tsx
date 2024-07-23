import { MagnifyingGlass } from "phosphor-react-native";
import { View, Text, TextInput, FlatList, ActivityIndicator } from "react-native";
import { styles } from "../styles";
import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { CardMovies } from "../../components/CardMovies";

interface Movie {
	id:number,
	title: string, 
	poster_path: string,
	overview: string
}

export function Home(){

	const [discoveryMovies, setDiscoveryMovies] = useState<Movie[]>([])
	const [searchResultMovies, setsearchResultMovies] = useState<Movie[]>([])
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [noResult, setnoResult] = useState(false);
	const [search, setSearch] = useState("");

	useEffect(() => {
		loadMoreData();
	}, []);

	
	const loadMoreData = async () => {
		setLoading(true)
		const response = await api.get("/movie/popular", {
			params:{
				page,
			},
		});
		setDiscoveryMovies([...discoveryMovies ,...response.data.results]);
		setPage(page + 1)
		setLoading(false)
	}

	const searchMovies = async (query:string) => {
		setLoading(true)
		const response = await api.get("/search/movie", {
			params:{
				query,
			},
		});
		if (response.data.results.length === 0) {
			setnoResult(true)
			setnoResult(false)
			setsearchResultMovies([])
		} else {
			setsearchResultMovies(response.data.results)
		}
		setLoading(true)
	}

	const handleSearch = (text:string) => {
		setSearch(text)
		if (text.length > 1) {
			searchMovies(text)
		} else {
			setsearchResultMovies([])
		}
	}

	const movieData = search.length > 2 ? searchResultMovies: discoveryMovies

	return(
		<View style={styles.container}>
			<View>
			<Text style={styles.headerText}>O que você quer ver hoje</Text>
			<View style={styles.containerInput}>
				<TextInput placeholderTextColor="#FFF" placeholder="Pesquise aqui" style={styles.input} value={search} onChangeText={handleSearch}/>
				<MagnifyingGlass color="#FFF" size={25} weight="light" />
			</View>

			{noResult && (
				<Text style={styles.noResult}>
					Nenhum Filme encontrado para "{search}"
				</Text>
			)}
			</View>
			<View>
				<FlatList 
					data={movieData}
					numColumns={3}
					renderItem={(item) => <CardMovies data={item.item}/>}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={
						{
							padding:30,
							paddingBottom: 100,
						}
					}
					onEndReached={() => loadMoreData()} //A aplicação é carregada quado chega no fim 
					onEndReachedThreshold={0.4} //A aplicação é recarregada quando chega em 40% da tela 
				/>
				{/* Carregamento */}
				{loading && <ActivityIndicator size={50} color="#0296e5"/>} 
			</View>
		</View>
	);
}