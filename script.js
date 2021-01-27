'use strict';
(function() {

	// the "Factor" button
	var button = document.querySelector('#factor-button');

	// the input area where user types their number
	var input = document.querySelector('#number');

	// the <div> where we'll put our response
	var responseDiv = document.querySelector('#response');

	var answerDiv = responseDiv.querySelector('#answer');
	var solutionDiv = responseDiv.querySelector('#solution');

	// onclick event for the Factor button
	button.addEventListener( 'click', function() {
		
		var factorer = new Factorer( input.value );
		factorer.run();
		factorer.report();
		
	} );

	/**
	 * Factors integers into primes and displays the result to the document
	 */
	function Factorer( n ) {

		var factorer = this;

		this.n = parseInt( n );

		if( isNaN( this.n ) || this.n < 0 ) {
			this.n = 0;
		}

		// minimal list of all numbers to check to find the factorization
		this.numbersToCheck = null;

		this.workingNumber = this.n;

		this.factors = [];
		this.factorPowers = {};

		this.isPrime = false;

		// response(s) to 
		this.response = [];

		/**
		 * Main routine to factor the number
		 */
		this.run = function() {

			// make sure we have a valid number
			if( this.n < 2 ) {
				return;
			}

			this.response.push( 'Factoring ' + this.n + '...' );

			this.getNumbersToCheck();
			this.checkNumbers();
		}

		/**
		 * Get the minimal list of all numbers to check to find the factorization
		 */
		this.getNumbersToCheck = function() {

			if( null !== this.numbersToCheck ) {
				return this.numbersToCheck;
			}

			this.numbersToCheck = [];

			this.sqrt = Math.sqrt( this.n );

			this.response.push( 'We need to check all prime numbers less than or equal to ' +
				'the square root of ' + this.n + ', which is ' + this.sqrt 
			);

			// loop through all numbers up to the square root of (n)
			loop1:
			for( var i = 2; i <= this.sqrt; i++ ) {

				// if the array of numbers to check is empty then just put the current number (i) in the array
				// and then move along to (i+1)
				if( this.numbersToCheck.length === 0 ) {
					this.numbersToCheck.push( i );
					continue;
				}

				// if the array of numbers to check is not empty, then see if any numbers in the array
				// are factors of the current number in the loop (i)
				loop2:
				for( var j = 0; j < this.numbersToCheck.length; j++ ){
					var number = this.numbersToCheck[j];

					// if we found a factor of (i) that's already in our list of numbers to check,
					// then we know that (i) is not important and we can skip to (i+1)
					if( i % number === 0 ) {
						continue loop1;
					}
				}

				// if we made it this far, then this is an important number that we need to check
				this.numbersToCheck.push( i );
			}

			return this.numbersToCheck;

		} // getNumbersToCheck()

		this.checkNumbers = function() {

			var numbersString = this.numbersToCheck.join(', ');
			this.log( numbersString ? 
				'Numbers to check: ' + numbersString : 
				'No numbers to check!' 
			);

			this.divider();

			for( var i = 0; i < this.numbersToCheck.length; i++ ) {

				var number = this.numbersToCheck[i];

				this.log( 'Checking ' + number + ': ' );

				var remainder = this.n % number;
				if( 0 !== remainder ) {
					this.fail( 'remainder: ' + remainder );
				}
				else {

					this.success( 'remainder: ' + remainder );
					this.success( number + ' is a prime factor of ' + this.n );
					this.processFactor( number );
				}

				if( 1 === this.workingNumber ) {
					this.success( 'We can stop here!' );
					break;
				}

				this.divider();
			};

			if( 1 !== this.workingNumber ) {
				this.processWorkingNumber();
			}
		} // checkNumber()

		this.processFactor = function( number ) {

			this.log( this.workingNumber + '/' + number + ' = ' + this.workingNumber / number );
			this.workingNumber = this.workingNumber / number;

			// if we don't have this factor in the list yet
			if( this.factors.indexOf( number ) < 0 ) {
				this.factors.push( number );
				this.factorPowers[ number ] = 1;
			}
			else {
				this.factorPowers[ number ]++;
			}

			if( 0 === this.workingNumber % number ) {
				this.processFactor( number );
			}
		}

		this.processWorkingNumber = function() {

			if( 0 === this.factors.length ) {
				this.success( this.n + ' is prime.' );
				return;
			}

			this.log( 'After checking all numbers we have an additional factor of ' + 
				this.workingNumber + ' which we know is prime, because no number can have two prime ' +
				'factors greater than its square root.'
			);
			this.factors.push( this.workingNumber );
		}

		this.getFactorization = function() {

			if( 1 === this.n || 0 === this.n ) {
				return false;
			}

			this.isPrime = ( 0 === this.factors.length );
			if( this.isPrime ) {
				return this.n;
			}

			var powers = [];
			this.factors.forEach(function( number ) {
				var power = factorer.factorPowers[number];
				var string = number + 
					( power > 1 ? '<sup>' + power + '</sup>' : '' );
				powers.push( string );
			});

			return powers.join( ' &middot; ' );
		}

		/**
		 * Add messages to the queue
		 */
		this.log = function( message ) {
			this.response.push( message );
		}

		this.divider = function() {
			this.log('--------');
		}

		this.success = function( message ) {
			this.log( '<span class="success">' + message + '</span>' );
		}
		this.fail = function( message ) {
			this.log( '<span class="fail">' + message + '</span>' );
		}

		/**
		 * Display the response(s) in the document
		 */
		this.report = function() {

			var factorization = this.getFactorization();
			if( ! factorization ) {
				answerDiv.innerHTML = '<p class="fail">You entered an invalid number.  Try any integer greater than 1.</p>';
				return;
			}

			answerDiv.innerHTML = '<p class="success">' + this.getFactorization() + 
				( this.isPrime ? ' is prime' : '' ) + '</p>';

			solutionDiv.innerHTML = '<h2>Solution</h2>';

			this.response.forEach(function( statement ) {
				solutionDiv.innerHTML += '<p>' + statement + '</p>';
			});
		}

	} // Factorer()

})();
