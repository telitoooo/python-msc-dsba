import { md } from "../helpers.js";

export default {
  "m8-l1": {
    ex1: {
      title: "Creating and shaping arrays",
      core: {
        title: "First arrays",
        prompt: md`
          Create with NumPy:

          1. \`a\`: the integers from 1 to 8 with \`np.arange\`;
          2. \`m\`: \`a\` reorganised into **2 rows and 4 columns**;
          3. \`z\`: an array of zeros with shape \`(3, 3)\`;
          4. \`lin\`: 5 evenly spaced values from 0 to 1 included;
          5. \`info\`: the tuple \`(m.ndim, m.shape, m.size)\`;
          6. \`cube\`: the \`temperatures\` array (12 values) reorganised into shape \`(2, 2, 3)\`.
        `,
        hint: md`
          \`np.arange(start, stop)\` excludes the stop, like \`range\`. \`np.linspace(start, stop, count)\` includes it.
        `,
        tests: [
          "`a` contains 1, 2, …, 8",
          "`m` has shape (2, 4)",
          "`z`: zeros with shape (3, 3)",
          "`lin` is [0, 0.25, 0.5, 0.75, 1]",
          "`info` is `(2, (2, 4), 8)`",
          "`cube` has shape (2, 2, 3)",
        ],
      },
      extra: {
        title: "List or array?",
        prompt: md`
          1. \`doubled_list\`: \`my_list * 2\`; \`doubled_array\`: \`arr * 2\`. Compare!
          2. \`squares\`: the square of each element of \`arr\`, **without a loop**.
          3. \`mixed_type\`: the \`dtype\` of \`np.array([1, 2.5, 3])\`.
          4. \`swapped_shape\`: the shape of \`np.arange(24).reshape(2, 3, 4)\` after swapping axes 0 and 2
             (\`np.swapaxes\`).
          5. \`flat\`: the **transpose** of \`np.arange(6).reshape(2, 3)\`, flattened into one dimension
             (\`.T\` then \`.flatten()\`).
        `,
        tests: [
          "`doubled_list` repeats the list",
          "`doubled_array` doubles each element",
          "`squares` is [1, 4, 9] without a loop",
          "`mixed_type` is `float64`",
          "`swapped_shape` is (4, 3, 2)",
          "`flat` is [0, 3, 1, 4, 2, 5]",
        ],
      },
      stretch: {
        title: "Describing and reshaping",
        prompt: md`
          1. \`describe(arr)\` returns a dictionary \`{"ndim": …, "shape": …, "size": …, "dtype": …}\` (the dtype as a
             **string**, for instance \`"int64"\`).
          2. \`reshape_rows(arr, rows)\` returns \`arr\` reorganised into \`rows\` rows (the number of columns is computed
             thanks to \`-1\`), or \`None\` if it is impossible (instead of raising an error).
          3. \`build()\` returns a tuple of three arrays: the 3 × 3 identity matrix **of integers**, a \`(2, 3)\` array
             filled with 7, and the “cube” \`np.arange(24).reshape(2, 3, 4)\` **transposed** (\`.T\`).
        `,
        hint: md`
          Reshaping into \`rows\` rows is possible if \`arr.size\` is divisible by \`rows\`. \`np.eye(3, dtype=int)\`,
          \`np.full((2, 3), 7)\`.
        `,
        tests: [
          "`describe` describes a 2D integer array",
          "`describe` works with floats",
          "`reshape_rows(np.arange(12), 4)` has shape (4, 3)",
          "Impossible reshape → `None`",
          "`build()` returns integer identity, array of 7s and transposed cube",
        ],
      },
    },
  },

  "m8-l2": {
    ex1: {
      title: "Axes and indexing",
      core: {
        title: "The table from the lesson",
        prompt: md`
          From \`table\` (the 4 × 4 array of the lesson), compute **without a loop**:

          - \`overall_max\`: the maximum of the whole array;
          - \`col_max\` and \`row_max\`: the maximum of each column / of each row;
          - \`row_sums\`: the sum of each row;
          - \`second_row\`: the row at index 1, \`third_col\`: the column at index 2;
          - \`corner\`: the bottom-right 2 × 2 block;
          - \`value\`: the element at row 1, column 3.
        `,
        tests: [
          "`overall_max` is 9",
          "`col_max` is [5, 6, 7, 9] and `row_max` [7, 9, 1, 4]",
          "`row_sums` is [16, 24, 4, 9]",
          "`second_row` and `third_col`",
          "`corner` is [[1, 1], [2, 0]]",
          "`value` is 9, and no loop",
        ],
      },
      extra: {
        title: "Magic square",
        prompt: md`
          A square is **magic** if all its rows, all its columns and **both** diagonals have the same sum. Write
          \`is_magic(square)\` that returns \`True\` or \`False\` (a non-square array is not magic).

          Test it on Dürer's square (\`durer\`, sum 34), the Lo Shu square (\`lo_shu\`, sum 15) and an ordinary square.
        `,
        hint: md`
          Row sums: \`square.sum(axis=1)\`, column sums: \`square.sum(axis=0)\`. Diagonals: \`np.trace(square)\` and
          \`np.trace(np.fliplr(square))\`. To check that all values of an array equal \`target\`: \`(values == target).all()\`.
        `,
        tests: [
          "Dürer's square is magic",
          "The Lo Shu square is magic",
          "An ordinary square is not",
          "Rows and columns OK but wrong diagonal → `False`",
          "A non-square array is not magic",
        ],
      },
      stretch: {
        title: "Views, copies and ranking",
        prompt: md`
          \`grades\` holds the grades (out of 20) of 4 students (rows) in 3 exams (columns).

          1. \`with_bonus(grades, exam, bonus)\` returns a **new** array where exam \`exam\` (a column) receives
             \`bonus\` points, without exceeding 20; the original array must **not** be modified.
          2. \`best_student(grades, names)\` returns the name of the student with the best average.
          3. \`hardest_exam(grades)\` returns the index of the exam with the lowest average.
          4. \`passed_all(grades, names)\` returns the list of names of the students with at least 10 in **every** exam.
        `,
        hint: md`
          A slice is a **view**: do \`result = grades.copy()\` before modifying. \`np.minimum(a, 20)\` caps at 20.
          \`argmax\` / \`argmin\` with \`axis\`, and \`(grades >= 10).all(axis=1)\` for point 4.
        `,
        tests: [
          "`with_bonus` adds the bonus to the right column, capped at 20",
          "`with_bonus` does not modify `grades`",
          "`best_student` → Grace",
          "`hardest_exam` → 1 (also with other grades)",
          "`passed_all` → Ada and Grace",
        ],
      },
    },
  },

  "m8-l3": {
    ex1: {
      title: "Vectorised computing and broadcasting",
      core: {
        title: "Prices and orders",
        prompt: md`
          *Hands-on from the course.* From \`prices\`, \`quantities\` and \`orders\` (one row per order of the day, one
          column per product), compute **without any loop**:

          - \`total\`: the total price of \`quantities\`;
          - \`sold_per_product\`: the quantity sold of each product during the day;
          - \`value_per_product\`: the amount sold of each product;
          - \`total_per_order\`: the amount of each order.
        `,
        tests: [
          "`total` is 39.70",
          "`sold_per_product` is [32, 3, 5, 11]",
          "`value_per_product`",
          "`total_per_order`",
          "No Python loop",
        ],
      },
      extra: {
        title: "Curve centering",
        prompt: md`
          *Hands-on “Curve Centering”.* The exam was too hard: we want to **re-centre** the grades (out of 100) around a
          target mean \`center\` (80 by default). Compute the gap between \`center\` and the mean of the grades, then add
          it to **every** grade, **without exceeding 100**.

          Write \`curve(grades, center=80)\`, which returns a **new** array, without a loop.
        `,
        hint: md`The shift is a plain number: broadcasting adds it to the whole array. \`np.minimum(…, 100)\` or \`np.clip\`.`,
        tests: [
          "No grade exceeds 100",
          "The shift is applied to every grade",
          "Without the cap, the mean becomes `center`",
          "The original grades are not modified",
          "`curve` contains no loop",
        ],
      },
      stretch: {
        title: "Broadcasting in action",
        prompt: md`
          With no loop (nor comprehension) in your functions:

          1. \`mult_table(n)\`: the \`(n, n)\` multiplication table from 1 to \`n\` (\`table[i, j] = (i+1)(j+1)\`);
          2. \`distance_matrix(points)\`: for an \`(n, 2)\` array of points, the \`(n, n)\` matrix of Euclidean
             distances between all pairs;
          3. \`nearest_neighbor(points)\`: for each point, the index of the **closest point other than itself**.
        `,
        hint: md`
          \`points[:, np.newaxis, :] - points[np.newaxis, :, :]\` has shape \`(n, n, 2)\`: all the differences at once.
          Then \`np.sqrt((diff ** 2).sum(axis=-1))\`. To ignore the distance of a point to itself, add
          \`np.diag(np.full(n, np.inf))\` (or use \`np.fill_diagonal\` on a copy) before \`argmin(axis=1)\`.
        `,
        tests: [
          "`mult_table(4)`",
          "`distance_matrix`: shape and values",
          "`nearest_neighbor(pts)` is [2, 2, 0, 1]",
          "Works on 50 random points",
          "No loop in the three functions",
        ],
      },
    },
  },

  "m8-l4": {
    ex1: {
      title: "Filtering, sorting, assembling",
      core: {
        title: "Masks and filters",
        prompt: md`
          \`numbers\` is the 4 × 6 array of the lesson. Create, **without a loop**:

          - \`mask\`: the mask of multiples of 4, and \`by_four\` the matching values;
          - \`n_by_four\`: the number of multiples of 4;
          - \`between\`: the values strictly between 20 and 40;
          - \`labels\`: an array of the same shape containing \`"even"\` or \`"odd"\` (\`np.where\`);
          - \`clipped\`: a **copy** of \`numbers\` where values above 40 are replaced by 40.
        `,
        tests: [
          "`mask` is a (4, 6) boolean mask",
          "`by_four`: the 11 multiples of 4",
          "`between`: values between 20 and 40 excluded",
          "`labels` contains even / odd",
          "`clipped` caps at 40 without modifying `numbers`",
          "No loop",
        ],
      },
      extra: {
        title: "The week's temperatures",
        prompt: md`
          \`temps\` holds the temperatures of 4 cities (rows, names in \`cities\`) over 7 days, and \`next_week\` those of
          the following week.

          - \`hot_days\`: for each city, the number of days **above 30 °C**;
          - \`ranking\`: the **list** of city names sorted by **decreasing** mean temperature (\`np.argsort\`);
          - \`two_weeks\`: both weeks side by side, shape \`(4, 14)\`;
          - \`all_sorted\`: all the temperatures of both weeks, flattened and sorted (\`np.concatenate(…, axis=None)\`).
        `,
        tests: [
          "`hot_days` is [2, 3, 5, 0]",
          "`ranking`: Marseille, Lyon, Paris, Lille",
          "`two_weeks` has shape (4, 14)",
          "`all_sorted` contains the 56 sorted values",
        ],
      },
      stretch: {
        title: "Structured arrays",
        prompt: md`
          \`heroes\` is a **structured** array (fields \`name\`, \`age\`, \`power\`).

          - \`strongest\`: the names of the heroes with a power **above 9000**;
          - \`by_age\`: the names sorted by increasing age (\`np.sort(…, order="age")\`);
          - \`mean_age\`: the mean age;
          - \`name_dtype\`: the type of the \`name\` field as a string (\`.dtype.str\`) — what does it mean?
          - \`young_powerful(data, max_age, min_power)\`: the **list** of names of the heroes aged ≤ \`max_age\` with
            a power ≥ \`min_power\`.
        `,
        tests: [
          "`strongest`: beyonce and ada",
          "`by_age`: sorted by age",
          "`mean_age` ≈ 40.33",
          "`name_dtype` is `'<U10'`",
          "`young_powerful(heroes, 40, 100)` → beyonce, ada",
        ],
      },
    },
  },

  "m8-l5": {
    ex1: {
      title: "Simulations",
      core: {
        title: "π by Monte-Carlo",
        prompt: md`
          *Hands-on 14.* Estimate π by drawing random points in the square [0, 1] × [0, 1].

          1. \`estimate_pi(n, seed=0)\`: creates a generator \`np.random.default_rng(seed)\`, first draws the \`n\`
             x-coordinates then the \`n\` y-coordinates (\`rng.random(n)\`), and returns 4 × (proportion of points such
             that x² + y² ≤ 1). **No loop.**
          2. \`convergence(n, seed=0)\`: with the **same draws**, returns the array of the \`n\` successive estimates
             (after 1 point, 2 points, …, n points), thanks to \`np.cumsum\`.
        `,
        hint: md`
          The mean of a boolean mask is the proportion of \`True\`. For the convergence:
          \`4 * np.cumsum(inside) / np.arange(1, n + 1)\`.
        `,
        tests: [
          "`estimate_pi(200_000)` is close to π (within 0.02)",
          "Same seed → same estimate",
          "`estimate_pi` contains no loop",
          "`convergence` returns n estimates",
          "The last estimate of `convergence` is that of `estimate_pi`",
        ],
      },
      extra: {
        title: "Flight seats",
        prompt: md`
          *Hands-on “flight seats assignment”.* In a plane with \`n_seats\` seats, passengers board in the order 0, 1, …,
          n−1; passenger \`i\` has seat \`i\`. Passenger 0 sits **at random**; then each one takes their own seat if it is
          free, otherwise a **random** free seat.

          1. \`last_gets_own_seat(n_seats, rng)\` simulates **one** flight and returns \`True\` if the last passenger gets
             their own seat;
          2. \`probability(n_flights, n_seats, seed=0)\` simulates \`n_flights\` flights with a generator
             \`np.random.default_rng(seed)\` and returns the proportion of successes (a \`float\`).

          What do you notice? Does it depend on the number of seats?
        `,
        hint: md`
          A set \`free = set(range(n_seats))\` of free seats works well. To pick a random free seat:
          \`rng.choice(list(free))\`. No need to simulate the last passenger: a single seat is left.
        `,
        explanation: md`
          The probability is **1/2**, whatever the number of seats! Whenever someone is “displaced”, the first
          passenger's seat and the last passenger's seat play perfectly symmetric roles: whichever is taken first decides
          the fate of the last passenger.
        `,
        tests: [
          "`last_gets_own_seat` returns a boolean",
          "With 2 seats, about one chance in two",
          "With 100 seats, still about 1/2",
          "`probability` is reproducible and returns a `float`",
        ],
      },
      stretch: {
        title: "The π series",
        prompt: md`
          *Hands-on “π (much harder)”, session 1.* Three series converge to π:

          - **Leibniz**: π/4 = arctan(1);
          - **Basel**: π²/6 = Σ 1/k² for k ≥ 1;
          - **Machin**: π/4 = 4·arctan(1/5) − arctan(1/239),

          with arctan(x) = Σ (−1)ᵏ x²ᵏ⁺¹ / (2k + 1) for k ≥ 0. With no loop in the functions:

          1. \`arctan_series(x, n)\`: the sum of the first \`n\` terms (k = 0 … n−1);
          2. \`pi_leibniz(n)\`, \`pi_basel(n)\` (n terms k = 1 … n) and \`pi_machin(n)\`;
          3. \`errors\`: a dictionary \`{"leibniz": […], "basel": […], "machin": […]}\` of the **relative** errors
             |approx − π| / π for N = 10, 100, 1000, 10000;
          4. **exponential convergence**: for Machin, the error decreases like α·e^(−βN). Compute \`beta\` by fitting a
             line on log(error) for N = 1 … 8 (\`np.polyfit(N, np.log(err), 1)\`: the slope is −β). Beyond that, the
             error reaches a **plateau**: the precision of \`float\` numbers (≈ 1e-16).
        `,
        hint: md`
          \`k = np.arange(n)\`, then \`((-1.0) ** k * x ** (2 * k + 1) / (2 * k + 1)).sum()\`. For Basel:
          \`k = np.arange(1, n + 1)\` and \`np.sqrt(6 * (1 / k**2).sum())\`.
        `,
        explanation: md`
          Leibniz and Basel converge **slowly** (error in 1/N); Machin's formula gains about 1.4 digits per term:
          β ≈ 2·ln 5 ≈ 3.2, because each term is multiplied by (1/5)² = 1/25. From N ≈ 10 on, you hit the error plateau
          due to the precision of floating-point numbers. Module 9 will have you plot these errors on a semi-log chart.
        `,
        tests: [
          "`arctan_series(1, 1000)` ≈ π/4",
          "`arctan_series(0.5, 30)` ≈ arctan(0.5)",
          "The three approximations are correct",
          "`errors`: 3 series × 4 relative errors",
          "Machin is the fastest (error < 1e-14 from N = 10)",
          "`beta` ≈ 2·ln 5 ≈ 3.2",
          "No loop in the series",
        ],
      },
    },
  },
};
