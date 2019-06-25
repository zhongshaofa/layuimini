<?php
/**
 * 模拟接口
 */

$get = $_GET;
$page = !empty($get['page']) ? $get['page'] : 1;
$limit = !empty($get['limit']) ? $get['limit'] : 10;

$startNum = ($page * $limit) - $limit + 1;
$data = [];

for ($limit; $limit > 0; $limit-- && $startNum++) {
    $data[] = [
        'id'         => $startNum,
        'username'   => "姓名-{$startNum}",
        'sex'        => "性别-{$startNum}",
        'city'       => "城市-{$startNum}",
        'sign'       => "签名-{$startNum}",
        'experience' => 646,
        'logins'     => 53,
        'wealth'     => 53,
        'classify'   => "作家",
        'score'      => 80,
    ];
}

$result = [
    'code'  => 0,
    'msg'   => '获取数据成功！',
    'count' => 10000,
    'data'  => $data,
];

die(json_encode($result, JSON_UNESCAPED_UNICODE));