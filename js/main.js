class Blackjack {
	constructor(bj_obj) {
		this.cards_dealer = bj_obj.cards_dealer;
		this.cards_player = bj_obj.cards_player;
		this.bet = bj_obj.bet;
		this.more = bj_obj.more;
		this.leave = bj_obj.leave;
		this.active = bj_obj.active;
		this.admin_list = bj_obj.admin_list;
		this.winner = {};
		this.balance = bj_obj.balance;
	}

	game_start() {
		console.log('Game start');

		this.arr_bet = [];

		if ( localStorage.amount_player ) {
			this.balance.innerText = parseInt(localStorage.amount_player).toLocaleString('en-US');
			if ( parseInt(localStorage.amount_player) == 0 ) {
				this.active.forEach(item => {
					if ( !item.classList.contains('hidden') ) {
						item.classList.add('hidden');
					}
				})
				localStorage.clear();
				localStorage.setItem('amount_player', 3500);
			}
		} else {
			localStorage.clear();
			localStorage.setItem('amount_player', 3500);
		}

		for ( let bet of this.bet ) {
			bet.addEventListener('click', (e) => {
				const bet_value = e.target;

				this.arr_bet.push(parseInt(bet_value.innerText));
				this.bets = this.arr_bet.reduce((sum, current) => {
					return sum + current;
				}, 0);
				this.admin_list.children[0].innerText = 'Ставка: ' + this.bets.toLocaleString('en-US') + '$';

				this.inited || setTimeout((e) => {
					const balance_update = parseInt(localStorage.amount_player) - this.bets;

					if ( balance_update < 0 ) {
						this.bets = parseInt(localStorage.amount_player);
						this.admin_list.children[0].innerText = 'Ставка: ' + this.bets.toLocaleString('en-US') + '$';
						this.balance.innerText = 0;

						localStorage.amount_player = 0;
					} else {
						this.balance.innerText = balance_update;
						localStorage.amount_player = parseInt(localStorage.amount_player) - this.bets;
					}

					console.log('0', localStorage.amount_player);

					this.active[0].classList.add('hidden');
					this.distribution_of_cards();
				}, 3000);

				this.inited = 1;
			});
		}
	}

	generate_cards(user, count) {
		const cards = ['A', 'K', 'Q', 'J', 10, 9, 8, 7, 6, 5, 4, 3, 2];
		const cards_obj = {
			diamonds: [cards, 'diamonds', 1],
			clubs: [cards, 'clubs', 2],
			hearts: [cards, 'hearts', 3],
			spades: [cards, 'spades', 4],
		}
		
		for ( let i = 0; i < count; i++ ) {
			let random = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
			let random_suit = cards_obj[Object.keys(cards_obj)[random]];
			let random_card = Math.floor(Math.random() * (random_suit[0].length - 1)) + 0;
			
			user.push({suit: random_suit[2], card: random_suit[0][random_card]});
			console.log(`Suit - ${random_suit[2]} | cards - ${random_suit[0][random_card]}`);
		}
	}

	distribution_of_cards() {
		const dealer = [];
		const pre_dealer = [];
		const player = [];

		this.generate_cards(dealer, 2);
		this.generate_cards(player, 2);

		const board = {
			dealer: dealer,
			player: player,
		}

		this.amount_cards(board);

		pre_dealer.push(board.dealer[0]);

		this.cards_update(pre_dealer, this.cards_dealer);
		this.cards_update(board.player, this.cards_player);

		this.admin_list.children[1].innerText = 'Игрок: ' + board.amount_player;
		this.admin_list.children[2].innerText = 'Дилер: ' + board.amount_dealer;
	}

	amount_cards(board) {
		const cards_obj = {
			A: ["A", 11],
			K: ["K", 10],
			Q: ["Q", 10],
			J: ["J", 10],
		}
		let amount = 0;
		let amount_dealer = amount;
		let amount_player = amount;

		let cards_player = [];
		let cards_dealer = [];

		board.player.forEach(obj => {
			cards_player.push(obj.card);
		})

		board.dealer.forEach(obj => {
			cards_dealer.push(obj.card);
		})

		board.amount_player = this.amount_func(cards_player, amount_player, cards_obj);
		board.amount_dealer = this.amount_func(cards_dealer, amount_dealer, cards_obj);

		if ( cards_dealer ) {
			const last_card = cards_dealer[cards_dealer.length - 1];
			
			if ( typeof(last_card) == "string" ) {
				for ( let item of Object.keys(cards_obj) ) {
					if ( last_card == cards_obj[item][0] ) {
						board.amount_dealer = board.amount_dealer - cards_obj[item][1];
						board.real_amount_dealer = board.amount_dealer + cards_obj[item][1];
					}
				}
			} else {
				board.amount_dealer = board.amount_dealer - last_card;
				board.real_amount_dealer = board.amount_dealer + last_card;
			}
		}

		this.choice(board, cards_obj, board.real_amount_dealer);
	}

	amount_func(user, amount, cards_obj) {
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
	}

	create_cards(user, card, color) {
		const li = document.createElement('li');
		li.setAttribute('data-aos', 'flip-left');
		li.innerText = card.card;
		li.className = `bj-board__item ${color}`,
		user.appendChild(li);
	}

	cards_update(cards, user) {
		cards.forEach(card => {
			if ( card.suit == 1 ) {
				this.create_cards(user, card, 'diamonds');
			} else if ( card.suit == 2 ) {
				this.create_cards(user, card, 'clubs');
			} else if ( card.suit == 3 ) {
				this.create_cards(user, card, 'hearts');
			} else if ( card.suit == 4 ) {
				this.create_cards(user, card, 'spades');
			}
		})
	}

	wait_end(board) {
		setTimeout((e) => {
			this.game_end(board);
		}, 1000);
	}

	amount_check_player(board) {
		if ( board.amount_player > 21 ) {
			this.winner.amount_winner = board.real_amount_dealer;
			this.active[1].classList.add('hidden');
			this.wait_end(board);
		} else if ( board.amount_player == 21 ) {
			this.winner.amount_winner = board.amount_player;
			this.active[1].classList.add('hidden');
			this.wait_end(board);
		}
	}

	amount_check_dealer(board) {
		if ( board.real_amount_dealer > 21 ) {
			this.winner.amount_winner = board.amount_player;
			this.wait_end(board);
		} else if ( board.real_amount_dealer == 21 ) {
			this.winner.amount_winner = board.real_amount_dealer;
			this.wait_end(board);
		} else if ( board.real_amount_dealer > board.amount_player ) {
			this.winner.amount_winner = board.real_amount_dealer;
			this.wait_end(board);
		} else if ( board.real_amount_dealer == board.amount_player ) {
			this.winner.tie = true;
			this.wait_end(board);
		} else {
			this.winner.amount_winner = board.amount_player;
			this.wait_end(board);
		}
	}

	add_card(board, user, suit, cards_user, cards_obj) {
		let amount = 0;
		let amount_users = amount;
		const li = document.createElement('li');

		board.amount_users = this.amount_func(user, amount_users, cards_obj);
		li.innerText = user[user.length - 1];

		suit.forEach(color => {
			if ( color == 1 ) {
				li.className = 'bj-board__item diamonds';
			} else if ( color == 2 ) {
				li.className = 'bj-board__item clubs';
			} else if ( color == 3 ) {
				li.className = 'bj-board__item hearts';
			} else if ( color == 4 ) {
				li.className = 'bj-board__item spades';
			}
		})

		li.setAttribute('data-aos', 'flip-left');
		cards_user.appendChild(li);

		return board.amount_users;
	}

	choice(board, cards_obj) {
		this.amount_check_player(board);

		if ( board.amount_player < 21 ) {
			this.more.addEventListener('click', (e) => {
				const cards_player = [];
				const suit_player = [];

				this.generate_cards(board.player, 1);
				
				board.player.forEach(obj => {
					cards_player.push(obj.card);
					suit_player.push(obj.suit);
				});

				board.amount_player = this.add_card(board, cards_player, suit_player, this.cards_player, cards_obj);
				
				this.admin_list.children[1].innerText = 'Игрок: ' + board.amount_player;
				this.amount_check_player(board);
			});

			this.leave.addEventListener('click', (e) => {
				this.active[1].classList.add('hidden');

				for ( let item of Object.keys(this.cards_dealer.children) ) {
					this.cards_dealer.removeChild(this.cards_dealer.children[item]);
				}

				this.cards_update(board.dealer, this.cards_dealer);

				if ( board.real_amount_dealer < 17 ) {
					for ( let i = board.real_amount_dealer; i < 17; ) {
						if ( board.real_amount_dealer < 17 ) {
							const cards_dealer = [];
							const suit_dealer = [];

							this.generate_cards(board.dealer, 1);

							board.dealer.forEach(obj => {
								cards_dealer.push(obj.card);
								suit_dealer.push(obj.suit);
							});

							board.real_amount_dealer = this.add_card(board, cards_dealer, suit_dealer, this.cards_dealer, cards_obj);
							this.admin_list.children[2].innerText = 'Дилер: ' + board.real_amount_dealer;

						} else {
							this.amount_check_dealer(board);
							break;
						}
					}
				} else {
					this.amount_check_dealer(board);
					this.admin_list.children[2].innerText = 'Дилер: ' + board.real_amount_dealer;
				}
			});
		}
	}

	game_end(board) {
		const arr_winner = {
			dealer: ["Рука дилера оказалась сильнее!", board.real_amount_dealer],
			player: ["Рука игрока оказалась сильнее!", board.amount_player],
		};

		if ( this.winner.tie ) {
			this.admin_list.children[3].innerText = "Ничья.";
			localStorage.amount_player = parseInt(localStorage.amount_player) + this.bets;
			console.log(localStorage.amount_player);
		} else {
			for ( let win of Object.keys(arr_winner) ) {
				if ( arr_winner[win][1] == this.winner.amount_winner ) {
					this.admin_list.children[3].innerText = "Победитель: " + arr_winner[win][0];

					if ( arr_winner[win][1] == board.amount_player ) {
						if ( localStorage.amount_player ) {
							localStorage.amount_player = this.bets * 2 + parseInt(localStorage.amount_player);
							this.balance.innerText = localStorage.amount_player;
							console.log('1', localStorage.amount_player);
						} else {
							localStorage.amount_player = this.balance.innerText;
							console.log('2', localStorage.amount_player);
						}
					} else {
						this.balance.innerText = localStorage.amount_player;

						if ( parseInt(localStorage.amount_player) <= 0 ) {
							localStorage.amount_player = 0;
							this.balance.innerText = 0;
							console.log('-')
						} else {
							this.balance.innerText = localStorage.amount_player;
						}
					}
				}
			}
		}

		console.log('end', localStorage.amount_player);

		setTimeout(() => {
			location.reload();
		}, 2000);
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
	balance: document.querySelector('.bj-balance'),
}

let blackjack = new Blackjack(bj_obj);
blackjack.game_start();
