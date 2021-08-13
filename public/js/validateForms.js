$('.validated-form')
        .form({
            fields: {
                name: {
                identifier: 'title',
                rules: [
                    {
                    type   : 'empty',
                    prompt : 'Please enter a title'
                    }
                ]
                },
                skills: {
                identifier: 'location',
                rules: [
                    {
                    type   : 'empty',
                    prompt : 'Please enter a location'
                    }
                ]
                },
                price: {
                identifier: 'price',
                rules: [
                    {
                    type   : 'empty',
                    prompt : 'Please enter a price'
                    }
                ]
                },
                username: {
                    identifier: 'username',
                    rules: [
                        {
                        type   : 'empty',
                        prompt : 'Please enter a username'
                        }
                    ]
                },
                email: {
                    identifier: 'email',
                    rules: [
                        {
                        type   : 'empty',
                        prompt : 'Please enter an e-mail address'
                        }
                    ]
                },
                password: {
                    identifier: 'password',
                    rules: [
                        {
                        type   : 'empty',
                        prompt : 'Please provide a valid password'
                        }
                    ]
                },
            }
        });
        $(document).ready(function() {
            $('.right.menu.open').on("click", function(e) {
                e.preventDefault();
                $('.ui.vertical.menu').toggle();
            });
            $('.ui.dropdown').dropdown();
            bsCustomFileInput.init()
        });

        $('.message .close').on('click', function () {
            $(this).closest('.message').transition('fade');
        });
