import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CryptoTable from '../CryptoTable';

const mockData = [
	{
		id: 'bitcoin',
		name: 'Bitcoin',
		symbol: 'btc',
		image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
		current_price: 60000,
		market_cap: 1000000000,
		total_volume: 50000000,
		price_change_percentage_24h: 2.5,
		last_updated: new Date().toISOString(),
	},
	{
		id: 'ethereum',
		name: 'Ethereum',
		symbol: 'eth',
		image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
		current_price: 4000,
		market_cap: 500000000,
		total_volume: 20000000,
		price_change_percentage_24h: -1.2,
		last_updated: new Date().toISOString(),
	},
];

jest.mock('../../hooks/useCryptoData', () => () => ({
	cryptoData: mockData,
	loading: false,
	error: null,
	refreshData: jest.fn(),
}));

describe('CryptoTable', () => {
	it('renders table with crypto data', () => {
		render(
			<CryptoTable
				searchQuery=""
				onSelectCoin={() => {}}
				selectedCoin="bitcoin"
			/>
		);
		expect(screen.getByText('Bitcoin')).toBeInTheDocument();
		expect(screen.getByText('Ethereum')).toBeInTheDocument();
		expect(screen.getByText('btc')).toBeInTheDocument();
		expect(screen.getByText('eth')).toBeInTheDocument();
	});

	it('filters by search query', () => {
		render(
			<CryptoTable
				searchQuery="eth"
				onSelectCoin={() => {}}
				selectedCoin="ethereum"
			/>
		);
		expect(screen.queryByText('Bitcoin')).not.toBeInTheDocument();
		expect(screen.getByText('Ethereum')).toBeInTheDocument();
	});

	it('calls onSelectCoin when a row is clicked', () => {
		const onSelectCoin = jest.fn();
		render(
			<CryptoTable
				searchQuery=""
				onSelectCoin={onSelectCoin}
				selectedCoin="bitcoin"
			/>
		);
		fireEvent.click(screen.getByText('Ethereum'));
		expect(onSelectCoin).toHaveBeenCalledWith('ethereum');
	});
});
