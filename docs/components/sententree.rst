==================
    SentenTree
==================

A [SentenTree](https://github.com/twitter/SentenTree) sentence visualization.
Given a table of text samples about some topic, SentenTree attempts to abstract
out the common expressions between them, visualizing them as a flowing "sentence
tree".

The **data** table contains a list of objects, each with an **id** field
containing a unique identifier for each row, a **text** field containing the
text sample, and a **count** field expressing the strength of that sample, or
number of times it occurred in the corpus, etc.

This component can be found in the ``candela/plugins/sententree`` plugin.

Example
=======

.. raw:: html

    <div id="sententree-example" width="1200" height="700"></svg>
    <script type="text/javascript" >
      var el = document.getElementById('sententree-example');

      var data = [
        {id: 0, count: 3787, text: 'brazil\'s marcelo scores the first goal of the world cup ... against brazil.'},
        {id: 1, count: 2878, text: 'at least brazil have scored the first goal of the world cup'},
        {id: 2, count: 1702, text: 'first game of the world cup tonight! can\'t wait!'},
        {id: 3, count: 1689, text: 'the first goal of the world cup is an own goal! marcelo accidentally knocks it into his own net past julio cesar! croatia leads 1-0.'},
        {id: 4, count: 1582, text: 'goal: brazil 0-1 croatia marcelo scores an own goal in the 11th minute'},
        {id: 5, count: 1525, text: 'just like we predicted, a brazilian scored the first goal in the world cup'},
        {id: 6, count: 1405, text: 'whoever bet that the first goal of the world cup was going to be an own goal just made a lot of money.'},
        {id: 7, count: 1016, text: '736 players 64 matches 32 teams 12 stadiums 4 years of waiting 1 winning country the 2014 world cup has started .'},
        {id: 9, count: 996, text: 'watching the world cup tonight! with the tour fam'},
        {id: 10, count: 960, text: 'the first goal of the world cup was almost as bad as the opening ceremony.'},
        {id: 11, count: 935, text: 'live from the 2014 fifa world cup in brazil, the unveiling of the happiness flag.'},
        {id: 13, count: 915, text: 'world cup starts today!!!!!! amazing!!!'},
        {id: 14, count: 818, text: 'the first goal scored of the world cup 2014... was an own goal!'},
        {id: 15, count: 805, text: 'after 4 years, the wait is finally over.'},
        {id: 16, count: 803, text: 'that\'s not in the script! own goal from marcelo puts croatia up 0-1.'},
        {id: 17, count: 746, text: 'that moment when you score an own goal in the opening game of the world cup.'},
        {id: 18, count: 745, text: 'scoring on themselves in the world cup'},
        {id: 19, count: 719, text: 'world cup 2014 first goal is own-goal by marcelo'}
      ];

      var vis = new candela.components.SentenTree(el, {
        data: data,
        graphs: 3
      });
      vis.render();
    </script>

**JavaScript**

.. code-block:: html

    <body>
    <script src="//unpkg.com/candela/dist/candela-all.min.js"></script>
    <script>
      var el = document.createElement('div')
      el.setAttribute('width', 1200);
      el.setAttribute('width', 700);

      document.body.appendChild(el);

      var data = [
        {id: 0, count: 3787, text: 'brazil\'s marcelo scores the first goal of the world cup ... against brazil.'},
        {id: 1, count: 2878, text: 'at least brazil have scored the first goal of the world cup'},
        {id: 2, count: 1702, text: 'first game of the world cup tonight! can\'t wait!'},
        {id: 3, count: 1689, text: 'the first goal of the world cup is an own goal! marcelo accidentally knocks it into his own net past julio cesar! croatia leads 1-0.'},
        {id: 4, count: 1582, text: 'goal: brazil 0-1 croatia marcelo scores an own goal in the 11th minute'},
        {id: 5, count: 1525, text: 'just like we predicted, a brazilian scored the first goal in the world cup'},
        {id: 6, count: 1405, text: 'whoever bet that the first goal of the world cup was going to be an own goal just made a lot of money.'},
        {id: 7, count: 1016, text: '736 players 64 matches 32 teams 12 stadiums 4 years of waiting 1 winning country the 2014 world cup has started .'},
        {id: 9, count: 996, text: 'watching the world cup tonight! with the tour fam'},
        {id: 10, count: 960, text: 'the first goal of the world cup was almost as bad as the opening ceremony.'},
        {id: 11, count: 935, text: 'live from the 2014 fifa world cup in brazil, the unveiling of the happiness flag.'},
        {id: 13, count: 915, text: 'world cup starts today!!!!!! amazing!!!'},
        {id: 14, count: 818, text: 'the first goal scored of the world cup 2014... was an own goal!'},
        {id: 15, count: 805, text: 'after 4 years, the wait is finally over.'},
        {id: 16, count: 803, text: 'that\'s not in the script! own goal from marcelo puts croatia up 0-1.'},
        {id: 17, count: 746, text: 'that moment when you score an own goal in the opening game of the world cup.'},
        {id: 18, count: 745, text: 'scoring on themselves in the world cup'},
        {id: 19, count: 719, text: 'world cup 2014 first goal is own-goal by marcelo'}
      ];

      var vis = new candela.components.SentenTree(el, {
        data: data,
        graphs: 3
      });
      vis.render();
    </script>
    </body>

**Python**

.. code-block:: python

    import pycandela

    data = [
      {'id': 0, 'count': 3787, 'text': 'brazil\'s marcelo scores the first goal of the world cup ... against brazil.'},
      {'id': 1, 'count': 2878, 'text': 'at least brazil have scored the first goal of the world cup'},
      {'id': 2, 'count': 1702, 'text': 'first game of the world cup tonight! can\'t wait!'},
      {'id': 3, 'count': 1689, 'text': 'the first goal of the world cup is an own goal! marcelo accidentally knocks it into his own net past julio cesar! croatia leads 1-0.'},
      {'id': 4, 'count': 1582, 'text': 'goal: brazil 0-1 croatia marcelo scores an own goal in the 11th minute'},
      {'id': 5, 'count': 1525, 'text': 'just like we predicted, a brazilian scored the first goal in the world cup'},
      {'id': 6, 'count': 1405, 'text': 'whoever bet that the first goal of the world cup was going to be an own goal just made a lot of money.'},
      {'id': 7, 'count': 1016, 'text': '736 players 64 matches 32 teams 12 stadiums 4 years of waiting 1 winning country the 2014 world cup has started .'},
      {'id': 9, 'count': 996, 'text': 'watching the world cup tonight! with the tour fam'},
      {'id': 10, 'count': 960, 'text': 'the first goal of the world cup was almost as bad as the opening ceremony.'},
      {'id': 11, 'count': 935, 'text': 'live from the 2014 fifa world cup in brazil, the unveiling of the happiness flag.'},
      {'id': 13, 'count': 915, 'text': 'world cup starts today!!!!!! amazing!!!'},
      {'id': 14, 'count': 818, 'text': 'the first goal scored of the world cup 2014... was an own goal!'},
      {'id': 15, 'count': 805, 'text': 'after 4 years, the wait is finally over.'},
      {'id': 16, 'count': 803, 'text': 'that\'s not in the script! own goal from marcelo puts croatia up 0-1.'},
      {'id': 17, 'count': 746, 'text': 'that moment when you score an own goal in the opening game of the world cup.'},
      {'id': 18, 'count': 745, 'text': 'scoring on themselves in the world cup'},
      {'id': 19, 'count': 719, 'text': 'world cup 2014 first goal is own-goal by marcelo'}
    ]

    pycandela.components.SentenTree(data=data, id='id', count='count', text='text')

**R**

.. code-block:: r

    library(candela)

    id = c(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19)
    count = c(3787, 2878, 1702, 1689, 1582, 1525, 1405, 1016, 996, 960, 935, 915, 818, 805, 803, 746, 745, 719)
    text = c('brazil\'s marcelo scores the first goal of the world cup ... against brazil.', 'at least brazil have scored the first goal of the world cup', 'first game of the world cup tonight! can\'t wait!', 'the first goal of the world cup is an own goal! marcelo accidentally knocks it into his own net past julio cesar! croatia leads 1-0.', 'goal: brazil 0-1 croatia marcelo scores an own goal in the 11th minute', 'just like we predicted, a brazilian scored the first goal in the world cup', 'whoever bet that the first goal of the world cup was going to be an own goal just made a lot of money.', '736 players 64 matches 32 teams 12 stadiums 4 years of waiting 1 winning country the 2014 world cup has started .', 'watching the world cup tonight! with the tour fam', 'the first goal of the world cup was almost as bad as the opening ceremony.', 'live from the 2014 fifa world cup in brazil, the unveiling of the happiness flag.', 'world cup starts today!!!!!! amazing!!!', 'the first goal scored of the world cup 2014... was an own goal!', 'after 4 years, the wait is finally over.', 'that\'s not in the script! own goal from marcelo puts croatia up 0-1.', 'that moment when you score an own goal in the opening game of the world cup.', 'scoring on themselves in the world cup', 'world cup 2014 first goal is own-goal by marcelo')

    data = data.frame(id, count, text)

    candela('SentenTree', data=data, id='id', color='class', threshold=0.4)

Options
=======

data (:ref:`Table <table>`)
    The data table.

id (String)
    The ID field. Can contain any data type, but the value should be unique to
    each data record.

text (String)
    The text sample field.

count (Integer)
    The field expressing the count or strength of each text sample.
