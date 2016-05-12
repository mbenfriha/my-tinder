function calcule($array) {

$array2 = [];

for ($i = 0; $i < count($array) - 1; $i++){

array_unshift($array2, explode(' ', $array[$i]));

for ($j = 0; $j < count($array2[$i])-1; $j++){
$tmp = explode(',', $array2[$i][$j]);
$tmp2 = explode(',', $array2[$i][$j + 1]);
$c1 = $tmp[0] - tmp2[0];
$c2 = tmp[1] - tmp2[1];
$repcarré = abs($c1) * abc($c1) + abs($c2) * abs($c2);
echo round(sqrt($repcarré), 2);
}

}

}