class Blackjack {
	constructor(bj_obj) {
		this.cards_dealer = bj_obj.cards_dealer;
		this.cards_player = bj_obj.cards_player;
		this.bet = bj_obj.bet;
		this.more = bj_obj.more;
		this.leave = bj_obj.leave;
		this.active = bj_obj.active;
		this.admin_list = bj_obj.admin_list;
	}

	game_start() {
		const arr_bet = [];

		for ( let bet of this.bet ) {
			bet.addEventListener('click', (e) => {
				const bet_value = e.target;

				arr_bet.push(Number(bet_value.innerText));

				const bet = arr_bet.reduce((sum, current) => {
					return sum + current;
				}, 0);

				this.admin_list.children[0].innerText = bet;

				this.inited || setTimeout((e) => {
					this.active[0].classList.add('hidden');
					this.distribution_of_cards();
				}, 1000);

				this.inited = 1;
			})
		}
	}

	generate_cards(user, count) {
		const card_deck = ['A', 'K', 'Q', 'J', 10, 9, 8, 7, 6, 5, 4, 3, 2];
		const deck_length = card_deck.length - 1;

		for ( let i = 0; i < count; i++ ) {
			const random_card = Math.floor(Math.random() * (deck_length - 0 + 1)) + 0;
			user.push(card_deck[random_card]);
		}
	}

	distribution_of_cards() {
		const dealer = [];
		const player = [];
		let amount = 0;
		let amount_dealer = amount;
		let amount_player = amount;

		this.generate_cards(dealer, 2);
		this.generate_cards(player, 2);

		const board = {
			dealer: dealer,
			player: player,
		}

		this.amount_cards(board, board.dealer, amount_dealer);
		this.amount_cards(board, board.player, amount_player);

		this.cards_update(board.dealer, this.cards_dealer);
		this.cards_update(board.player, this.cards_player);
	}

	amount_cards(board, user, amount) {
		const cards_obj = {
			A: ["A", 11],
			K: ["K", 10],
			Q: ["Q", 10],
			J: ["J", 10],
		}

		user.forEach(item => {
			if ( typeof(item) == "string" ) {
				for ( let card of Object.keys(cards_obj) ) {
					if ( item == cards_obj[card][0] ) {
						amount = amount + cards_obj[card][1];
					}
				}
			} else if ( typeof(item) == "number" ) {
				amount = amount + item;
			}
		})

		return amount;

		// function amount_func(user, amount) {
		// 	user.forEach(item => {
		// 		if ( typeof(item) == "string" ) {
		// 			for ( let card of Object.keys(cards_obj) ) {
		// 				if ( item == cards_obj[card][0] ) {
		// 					amount = amount + cards_obj[card][1];
		// 				}
		// 			}
		// 		} else if ( typeof(item) == "number" ) {
		// 			amount = amount + item;
		// 		}
		// 	})

		// 	return amount;
		// }

		// amount_player = amount_func(board.player, amount_player);
		// amount_dealer = amount_func(board.dealer, amount_dealer);

		board.amount_dealer = amount_dealer;
		board.amount_player = amount_player;

		console.log(amount)
		// this.choice(board);
	}

	cards_update(cards, user) {
		cards.forEach(card => {
			const li = document.createElement('li');
			li.innerText = card;
			li.className = 'bj-board__item';
			user.appendChild(li);
		})
	}

	choice(board) {
		console.log('asdasd');
		// if ( board.amount_player > 21 ) {
		// 	console.log('Lose!')
		// } else if ( board.amount_player == 21 ) {
		// 	console.log('Win!')
		// } else if ( board.amount_player < 21 ) {
		// 	this.more.addEventListener('click', (e) => {
		// 		this.generate_cards(board.player, 1);

		// 		console.log(board);
		// 	})
		// }
	}
}

const bj_obj = {
	cards_dealer: document.querySelector('.dealer'),
	cards_player: document.querySelector('.player'),
	bet: document.querySelectorAll('.bj-control__bet > ul > li'),
	more: document.querySelector('.bj-control__more'),
	leave: document.querySelector('.bj-control__leave'),
	active: document.querySelectorAll('.bj-control__active'),
	admin_list: document.querySelector('.bj-admin__list'),
}

let blackjack = new Blackjack(bj_obj);
blackjack.game_start();
// blackjack.distribution_of_cards();
// blackjack.test();